module.exports = (sequelize, DataTypes) => {
	const tasks = sequelize.define("db_task", // database table name
	{
		task_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		task_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		task_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		task_status_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_task_statuses', 
				key: 'task_status_id', 
			}
		},

		task_priority_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_task_priorities', 
				key: 'task_priority_id', 
			}
		},

        link_with_opportunity: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_opportunities', 
				key: 'opp_id', 
			}
		},

		due_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},

		lead_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_leads', 
				key: 'lead_id', 
			}
		},

        assigned_to: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_users', 
				key: 'user_id', 
			}
		},

		task_type: {
            type: DataTypes.ENUM('lead task', 'opportunity task'),
            allowNull: true,
			defaultValue: 'lead task'
        },

		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'db_users', 
				key: 'user_id', 
			}
		},

        description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

	},
	{ paranoid: true, timestamps: true },   
	);

	return tasks;
	};
