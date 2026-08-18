// alert("Page got Reloaded");
// DOM Elements
const micBtn=document.getElementById("micBtn");
const micIcon=document.getElementById("micIcon");
const aiStatus=document.getElementById("aiStatus");
const aiStatusTitle=document.getElementById("aiStatusTitle");
const aiStatusText=document.getElementById("aiStatusText");
const recordingTimer=document.getElementById("recordingTimer");
const timerText=document.getElementById("timerText");

// Recording Variables
let recorder;
let chunks=[];
let recording=false;
let stream=null;
let audioContext=null;
let analyser=null;
let microphone=null;
let silenceTimeout=null;
let recordingInterval=null;
let recordingSeconds=0;
let aiStatusTimer = null;

// Constants
const SILENCE_THRESHOLD=15;
const SILENCE_DELAY=2000;
const PENDING_VOICE_ACTION_KEY="pendingVoiceAction";
const PAGE_ROUTES={
    category:"/category/list",
    employee:"/employee/list",
    asset:"/asset/list",
    issue:"/issue/history",
    return:"/issue/history",
    scrape:"/scrape/list"
};
const PAGE_ROUTE_ALIASES={
    "/category":"/category/list",
    "/category/list":"/category/list",
    "/employee":"/employee/list",
    "/employee/list":"/employee/list",
    "/asset":"/asset/list",
    "/asset/list":"/asset/list",
    "/issue":"/issue/history",
    "/issue/history":"/issue/history",
    "/return":"/issue/history",
    "/scrape":"/scrape/list",
    "/scrape/list":"/scrape/list"
};
const voiceIntentRouting={
    add_category:{page:PAGE_ROUTES.category,handler:(window.categoryVoiceHandlers||{}).add_category},
    update_category:{page:PAGE_ROUTES.category,handler:(window.categoryVoiceHandlers||{}).update_category},
    delete_category:{page:PAGE_ROUTES.category,handler:(window.categoryVoiceHandlers||{}).delete_category},
    add_employee:{page:PAGE_ROUTES.employee,handler:(window.employeeVoiceHandlers||{}).add_employee},
    update_employee:{page:PAGE_ROUTES.employee,handler:(window.employeeVoiceHandlers||{}).update_employee},
    delete_employee:{page:PAGE_ROUTES.employee,handler:(window.employeeVoiceHandlers||{}).delete_employee},
    add_asset:{page:PAGE_ROUTES.asset,handler:(window.assetVoiceHandlers||{}).add_asset},
    update_asset:{page:PAGE_ROUTES.asset,handler:(window.assetVoiceHandlers||{}).update_asset},
    delete_asset:{page:PAGE_ROUTES.asset,handler:(window.assetVoiceHandlers||{}).delete_asset},
    add_issue:{page:PAGE_ROUTES.issue,handler:(window.issueVoiceHandlers||{}).add_issue},
    update_issue:{page:PAGE_ROUTES.issue,handler:(window.issueVoiceHandlers||{}).update_issue},
    delete_issue:{page:PAGE_ROUTES.issue,handler:(window.issueVoiceHandlers||{}).delete_issue},
    return_asset:{page:PAGE_ROUTES.return,handler:(window.returnVoiceHandlers||{}).return_asset},
    add_scrape:{page:PAGE_ROUTES.scrape,handler:(window.scrapeVoiceHandlers||{}).add_scrape},
    update_scrape:{page:PAGE_ROUTES.scrape,handler:(window.scrapeVoiceHandlers||{}).update_scrape},
    delete_scrape:{page:PAGE_ROUTES.scrape,handler:(window.scrapeVoiceHandlers||{}).delete_scrape}
};

// UI Functions
function showAiStatus(message,type="info"){
    if(!aiStatus||!aiStatusTitle||!aiStatusText){
        return;
    }
    aiStatus.className=`alert alert-${type} shadow`;
    aiStatusTitle.textContent="AI Assistant";
    aiStatusText.textContent=message;
    aiStatus.style.display="block";
}

function updateMic(state){
    if(!micBtn||!micIcon){
        return;
    }
    micBtn.classList.remove("recording","processing");
    if(state==="ready"){
        micIcon.className="bi bi-mic-fill";
        micBtn.title="AI Voice Assistant";
    }else if(state==="recording"){
        micBtn.classList.add("recording");
        micIcon.className="bi bi-stop-fill";
        micBtn.title="Stop Recording";
    }else if(state==="processing"){
        micBtn.classList.add("processing");
        micIcon.className="bi bi-hourglass-split";
        micBtn.title="Processing";
    }
}
function showTimer(){
    if(recordingTimer){
        recordingTimer.style.display="block";
    }
}
function hideTimer(){
    if(recordingTimer){
        recordingTimer.style.display="none";
    }
}
function startTimer(){
    recordingSeconds=0;
    if(timerText){
        timerText.textContent="00:00";
    }
    recordingInterval=setInterval(()=>{
        recordingSeconds++;
        const m=String(Math.floor(recordingSeconds/60)).padStart(2,"0");
        const s=String(recordingSeconds%60).padStart(2,"0");
        if(timerText){
            timerText.textContent=`${m}:${s}`;
        }
    },1000);
}
function stopTimer(){
    clearInterval(recordingInterval);
    hideTimer();
}
// Recording Functions
async function startRecording(){
    stream=await navigator.mediaDevices.getUserMedia({
        audio:true
    });
    recorder=new MediaRecorder(stream);
    chunks=[];
    recorder.ondataavailable=e=>{
        chunks.push(e.data);
    };
    recorder.start();
    recording=true;
    updateMic("recording");
    showAiStatus("Listening...","primary");
    showTimer();    
    startTimer();
    startSilenceDetection();
}

function stopRecording(){
    if(!recording) return;
    recording=false;
    stopTimer();
    stopSilenceDetection();
    updateMic("processing");
    showAiStatus("Processing voice...","warning");
    recorder.stop();
    recorder.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop());
        uploadVoice();
    };
}

// Silence Detection
function startSilenceDetection(){
    audioContext=new(window.AudioContext||window.webkitAudioContext)();
    analyser=audioContext.createAnalyser();
    microphone=audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize=512;
    const dataArray=new Uint8Array(analyser.frequencyBinCount);
    detectSilence(dataArray);
}

function stopSilenceDetection(){
    clearTimeout(silenceTimeout);
    if(audioContext){
        audioContext.close();
        audioContext=null;
    }
}

function detectSilence(dataArray){
    if(!recording) return;
    analyser.getByteFrequencyData(dataArray);
    let volume=0;
    for(let i=0;i<dataArray.length;i++){
        volume+=dataArray[i];
    }
    volume/=dataArray.length;
    if(volume<SILENCE_THRESHOLD){
        if(!silenceTimeout){
            silenceTimeout=setTimeout(()=>{
                if(recording){
                    stopRecording();
                }
            },SILENCE_DELAY);
        }
    }else{
        clearTimeout(silenceTimeout);
        silenceTimeout=null;
    }
    requestAnimationFrame(()=>detectSilence(dataArray));
}

// Upload Voice
async function uploadVoice(){
    const blob=new Blob(chunks,{
        type:"audio/webm"
    });
    const formData=new FormData();
    formData.append(
        "audio",
        blob,
        "voice.webm"
    );
    try{
        const response=await fetch("/voice",{
            method:"POST",
            body:formData
        });
        const data=await response.json();
        updateMic("ready");
        await handleVoiceResponse(data);
    }catch(err){
        updateMic("ready");
        showAiStatus(err.message,"danger");
    }
}

function normalizePath(path){
    return (path||"").replace(/\/+$/,"") || "/";
}

function getCurrentPath(){
    return normalizePath(window.location.pathname || "/");
}

function getIntentRouting(intent){
    return voiceIntentRouting[intent] || null;
}

function resolveNavigationPage(data){
    const candidate=data && (data.page || data.route || data.target);
    if(!candidate){
        return null;
    }
    const normalized=normalizePath(candidate);
    return PAGE_ROUTE_ALIASES[normalized] || normalized;
}

async function handlePageNavigation(data){
    const targetPage=resolveNavigationPage(data);
    if(!targetPage){
        showAiStatus("That navigation command was not recognized.","warning");
        return false;
    }
    const currentPath=getCurrentPath();
    if(currentPath===targetPage){
        showAiStatus(`You are already on ${targetPage}.`,"info");
        return true;
    }
    showAiStatus(`Navigating to ${targetPage}...`,`info`);
    window.location.href=targetPage;
    return true;
}

function getPendingVoiceAction(){
    try{
        const pending=sessionStorage.getItem(PENDING_VOICE_ACTION_KEY);
        return pending ? JSON.parse(pending) : null;
    }catch(err){
        return null;
    }
}

function savePendingVoiceAction(data){
    sessionStorage.setItem(PENDING_VOICE_ACTION_KEY, JSON.stringify({
        ...data,
        message:data.message||""
    }));
}

function clearPendingVoiceAction(){
    sessionStorage.removeItem(PENDING_VOICE_ACTION_KEY);
}

async function executeVoiceAction(payload){
    if(!payload||!payload.success){
        return false;
    }
    const intent=payload.intent || payload.tool || "";
    const routing=getIntentRouting(intent);
    if(!routing){
        return false;
    }
    if(payload.action!=="open_modal"){
        showAiStatus("This voice action is not supported yet.","warning");
        return false;
    }
    const currentPath=getCurrentPath();
    const targetPath=normalizePath(routing.page);
    if(currentPath!==targetPath){
        savePendingVoiceAction(payload);
        showAiStatus("Navigating to the relevant page...","info");
        window.location.assign(routing.page);
        return true;
    }
    if(typeof routing.handler !=="function"){
        showAiStatus("This voice action is not supported yet.","warning");
        return false;
    }
    await routing.handler(payload.arguments||{});
    return true;
}

async function resumePendingVoiceAction(){
    const pending=getPendingVoiceAction();
    if(!pending){
        return false;
    }
    const intent=pending.intent || pending.tool || "";
    const routing=getIntentRouting(intent);
    if(!routing){
        clearPendingVoiceAction();
        return false;
    }
    if(getCurrentPath()!==normalizePath(routing.page)){
        return false;
    }
    clearPendingVoiceAction();
    await executeVoiceAction(pending);
    return true;
}

// Voice Handlers
const handlers={
    ...(window.categoryVoiceHandlers||{}),
    ...(window.employeeVoiceHandlers||{}),
    ...(window.assetVoiceHandlers||{}),
    ...(window.issueVoiceHandlers||{}),
    ...(window.returnVoiceHandlers||{}),
    ...(window.scrapeVoiceHandlers||{})
};

function getActionName(data){
    return String(data && (data.action || data.type || data.tool || "") || "").toLowerCase();
}

async function handleVoiceResponse(data){
    if(!data || !data.success){
        updateMic("ready");
        console.log(data);
        showAiStatus(data && data.error ? data.error : "Unable to process your request.","danger");
        return;
    }

    const action=getActionName(data);
    const tool=String(data && data.tool || "").toLowerCase();

    if(action==="navigate_page" || tool==="navigate_page"){
        updateMic("ready");
        const handled=await handlePageNavigation(data);
        if(!handled){
            showAiStatus("Unable to navigate to that page.","warning");
        }
        return;
    }

    if(action==="open_modal"){
        updateMic("ready");
        const handled=await executeVoiceAction(data);
        if(!handled){
            showAiStatus("This voice action is not supported yet.","warning");
        }
        return;
    }

    updateMic("ready");
    showAiStatus("This voice action is not supported yet.","warning");
}
// Event Listeners
if(micBtn){
    micBtn.addEventListener("click",async()=>{
        if(recording){
            stopRecording();
            return;
        }
        try{
            await startRecording();
        }catch(err){
            updateMic("ready");
            hideTimer();
            showAiStatus(err.message,"danger");
        }
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    resumePendingVoiceAction();
});

window.addEventListener("load",()=>{
    resumePendingVoiceAction();
});

window.addEventListener("beforeunload",()=>{
    if(recording){
        stopRecording();
    }
    if(audioContext){
        audioContext.close();
    }
    clearInterval(recordingInterval);
    clearTimeout(silenceTimeout);
});