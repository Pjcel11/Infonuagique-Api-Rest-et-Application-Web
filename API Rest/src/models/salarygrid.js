module.exports = (sequelize, DataTypes) => {
	return sequelize.define('salaryGrid', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
        jobId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
        increasedIndex: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
        durationMonths: {
            type: DataTypes.INTEGER,
			allowNull: true
        },
        grossSalary: {
            type: DataTypes.DOUBLE,
			allowNull: true
        }
	}, {
		timestamps: false
	})
}