const sequelize = require("../config/database");
class TransactionService {
    async run(callback) {
        const transaction = await sequelize.transaction();
        try {
            const result = await callback(transaction);
            if (result && result.success === false) {
                await transaction.rollback();
                return result;
            }
            await transaction.commit();
            return result;
        }
        catch (err) {
            await transaction.rollback();
            return {
                success: false,
                error: err.message
            };
        }
    }
}
module.exports = new TransactionService();