module.exports = (sequelize, dataTypes) => {
    let alias = 'Category';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING(45),
            allowNull: false
        }
    };
    let config = {
        timestamps: true,
        paranoid: true 
    }
    const Category = sequelize.define(alias, cols, config); 


    Category.associate = models => {
        Category.hasMany(models.Subcategory, {
            as: "subCategories",
            foreignKey: "categoryId"
        });
    };
 
    return Category;
};