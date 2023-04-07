/*module.exports = (app) => {
    app.get('/', (req, res) => {
		  res.json({ data: "Hello World!" })
    })
}
*/
const path = require('path');

module.exports = (app) => {
  	app.get('/', (req, res) => {
    	res.sendFile(path.join(__dirname, '../..', 'index.html'));
  	});
}