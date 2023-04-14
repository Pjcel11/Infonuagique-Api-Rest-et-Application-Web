const { ValidationError, UniqueConstraintError } = require('sequelize')
const { salaryGrid } = require('../db/sequelize')


module.exports = (app) => {
	app.post('/salaryGrid', (req, res) => {
        const newGrid = req.body;
        var message = "lines successfully processed\n";
        // Itérer sur chaque line dans le JSON et faire ce que vous voulez avec
        for (const line of Object.values(newGrid)) {
            try {
                salaryGrid.create(line)
            .then(
                message += `La ligne ${line.jobId} ${line.level} ${line.durationMonths}' was created successfully.`
            )
            }catch{ 
                error => {
                    if(error instanceof ValidationError) {
                        return res.status(400).json({status:400, message: error.message, data: error})
                    }
                    if (error instanceof UniqueConstraintError){
                        return res.status(400).json({status:400, message: error.message, data: error})
                    }
                    const message= `This line is already existing Causing an error. Please retry.`
                    res.status(500).json({message, data:error})
                }
            }
            /*
            const lineId = line.jobId;
            const level = line.level;
            const increasedIndex = line.increasedIndex;
            const durationMonths = line.durationMonths;
            const grossSalary = line.grossSalary;
            console.log(line,lineId,level,increasedIndex,durationMonths,grossSalary)
            */
          // Faites ce que vous voulez avec les données de chaque line
          // ...
            
        }
      
        // Répondre à la requête avec un message approprié
        res.status(200).json({ message });
    });
    
}
