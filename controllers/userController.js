const { User } = require("../models")

async function create(req, res) {
    try {

        const user = await User.create(req.body);
        return res.status(200).json(user);
    } catch (error) {
        // Handle any potential errors here
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

async function list(req, res) {
    try {
        const user = await User.findAll();
        console.log(user);
        return res.status(200).json(user);

    } catch (error) {
        // Handle any potential errors here
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }

}

async function update(req, res) {
    try {
        const user = await User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        const userRes = await User.findByPk(req.params.id);
        return res.status(200).json(userRes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

async function remove(req, res) {
    try {
        const user = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        // Handle any potential errors here
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

async function show(req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json(user);
    }
    catch (error) {
        // Handle any potential errors here
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = {
    create,
    list,
    update,
    remove,
    show
}