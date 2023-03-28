module.exports = (app) => {
    app.get('/', (req, res) => {
		res.json({ data: "Hello World!" })
    })
}