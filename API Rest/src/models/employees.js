module.exports = (sequelize, DataTypes) => {
	return sequelize.define('employee', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		jobId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		seniority: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamps: false
	})
}