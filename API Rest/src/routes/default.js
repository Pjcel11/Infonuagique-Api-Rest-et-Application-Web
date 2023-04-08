module.exports = (app) => {
    app.get('/', (req, res) => {
		  res.status(200).json({status: 200, message: "OK"})
    })
}

// const path = require('path');

// module.exports = (app) => {
//   	app.get('/', (req, res) => {
//     	res.sendFile(path.join(__dirname, '../..', 'index.html'));
//   	});
// }