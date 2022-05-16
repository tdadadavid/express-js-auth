const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

app.use(express.json());

const users = [
    {
        name: "First user",
        password: "*****",
    }
];

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', async (req, res) => {

    try{

        const { name, password } = req.body;

        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log({ salt });
        console.log({ hashedPassword });

        const user = { name, password: hashedPassword };
        users.push(user);
        res.status(200).json(user);

    }catch {
        res.status(500).send();
    }

});

app.post('/api/users/login', async (req, res) => {

    const { name, password } =  req.body;

    const user = users.find(e => e.name === name);

    if (user){
        try {
             if (await bcrypt.compare(password, user.password)){
                 res.status(200).json({ message: "success" });
             }else{
                 res.status(400).json({ message: "Auth error: password incorrect." });
             }
        }catch {
            res.status(500).send({ message: "Oops! an error occurred" });
        }
        return;
    }

    res.status(404).json({ message: "Cannot find user" });
})

app.listen(3000, () => { console.log("server listening on port 3000" )});