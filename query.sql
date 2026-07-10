-- select * from asset_issue_table;
-- select * from asset_table;
-- select * from asset_category_table;
-- select * from employee_table;
-- UPDATE asset_table SET status = 'IN_STOCK' WHERE asset_id = 1;
-- drop table scrape_table cascade;
-- select * from scrape_table
-- create table employee_table(
-- employee_id serial primary key,
-- employee_name varchar(100),
-- email varchar(100),
-- department varchar(100),
-- branch varchar(100),
-- status varchar(100)not null check(status in ('ACTIVE','INACTIVE')),
-- joined_at date
-- );
    
-- create table asset_category_table(
-- category_id serial primary key,
-- category_name varchar(100)
-- );

-- create table asset_table(
-- asset_id serial primary key,
-- asset_name varchar(100),
-- serial_number varchar(100) unique not null,
-- make varchar(100),
-- model varchar(100),
-- purchase_date date,
-- purchase_price decimal(10,2),
-- status varchar(100) not null check(status in ('IN_STOCK','ISSUED','REPAIRED','SCRAPPED')),
-- category_id int references asset_category_table(category_id)
-- );

create table asset_issue_table(
issue_id serial primary key,
asset_id int references asset_table(asset_id),
employee_id int references employee_table(employee_id),
issue_date date,
return_date date,
reason varchar(1000)
);

create table scrape_table(
scrape_id serial primary key,
asset_id int references asset_table(asset_id),
scrape_date date,
reason varchar(1000)
);