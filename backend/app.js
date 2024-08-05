const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors')

// const bodyparser = require('body-parser');
// const Quotes = require('inspirational-quotes');



const app = express();
app.use(express.json());
app.use(cors())
const mongoURL = 'mongodb://localhost:27017/Brailesense?authSource=admin';


//by pass + connect frontend with backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

//template Schema
const userSchema = new mongoose.Schema({
    message: String
})

//template collection
const Datadb = mongoose.model('datas', userSchema);

//receive-set data from IOT
const realtimeSchema = new mongoose.Schema({
    data1: String,
    data2: String,
})
const Transac = mongoose.model('transac', realtimeSchema);

app.post('/mqtt-data', async(req, res) => {
    const userData = req.body;
    const data1wContent = await Transac.findOne({ data1: { $ne: "" } });
    const data2wContent = await Transac.findOne({ data2: { $ne: "" } });

    try {
        if (userData.data1 && data1wContent) {
            await Transac.deleteOne({ _id: data1wContent._id });
            const temp = new Transac({
                data1: userData.data1,
                data2: userData.data2
            })
            await temp.save()
            res.status(200).json({
                message: "mqtt push data success! (1)",
                newdata: temp
            })
        } else if (userData.data1 && !data1wContent) {
            const temp = new Transac({
                data1: userData.data1,
                data2: userData.data2
            })
            await temp.save()
            res.status(200).json({
                message: "mqtt push data success! (2)",
                newdata: temp
            })
        } else if (userData.data2 && data2wContent) {
            await Transac.deleteOne({ _id: data2wContent._id });
            const temp = new Transac({
                data1: userData.data1,
                data2: userData.data2
            })
            await temp.save()
            res.status(200).json({
                message: "mqtt push data success! (3)",
                newdata: temp
            })
        } else if (userData.data2 && !data2wContent) {
            const temp = new Transac({
                data1: userData.data1,
                data2: userData.data2
            })
            await temp.save()
            res.status(200).json({
                message: "mqtt push data success! (3)",
                newdata: temp
            })
        } else {
            throw new error("Something wrong!");
        }
    } catch (error) {
        console.error("MQTT Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
})



//Notepad in Web feature
const noteSchema = new mongoose.Schema({
    note_title: String,
    note_content: String,
    note_id: Number,
    note_writing: Boolean,
    note_reading: Boolean,
    pos_reading: Number
})

const Note = mongoose.model('notes', noteSchema);

app.get('/reset-pin', async(req, res) => {
    res.json({
        messsage: "000000"
    })
})

app.post('/activate', async(req, res) => {
    const data1wContent = await Transac.findOne({ data1: { $ne: "" } });
    const data2wContent = await Transac.findOne({ data2: { $ne: "" } });
    const writing_note = await Note.findOne({ note_writing: true });
    var msg = "";
    const braille = {
        "0001000000": "A",
        "0011000000": "B",
        "0001001000": "C",
        "0001001100": "D",
        "0001000100": "E",
        "0011001000": "F",
        "0011001100": "G",
        "0011000100": "H",
        "0010001000": "I",
        "0010001100": "J",
        "0001010000": "K",
        "0011010000": "L",
        "0001011000": "M",
        "0001011100": "N",
        "0001010100": "O",
        "0011011000": "P",
        "0011011100": "Q",
        "0011010100": "R",
        "0010011000": "S",
        "0010011100": "T",
        "0001010010": "U",
        "0011010010": "V",
        "0010001110": "W",
        "0001011010": "X",
        "0001011110": "Y",
        "0001010110": "Z",
        "1000000001": "remove",
        "1000000000": "move-left",
        "0000000001": "move-right",
        "0000000100": "read",
        "0100000000": "delete"
    };
    try {
        if (data1wContent && !data2wContent) {
            msg = data1wContent.data1 + "00000";
        } else if (!data1wContent && data2wContent) {
            msg = "00000" + data2wContent.data2;
        } else if (data1wContent && data2wContent) {
            msg = data1wContent.data1 + data2wContent.data2;
        }
        const result = braille[msg];

        console.log(result);
        if (!result) {
            throw new error("Cant Match Result");
        }

        console.log(writing_note);
        if (writing_note && result != "move-left" && result != "move-right" && result != "remove" && result != "read") {
            writing_note.note_content = writing_note.note_content + result;
            await writing_note.save();
            res.status(200).json({
                message: "Update Content success",
                respo: result
            })
            await Transac.deleteMany({});
        } else if (result == "move-left") {
            res.status(200).json({
                message: "Update Content success",
                move: result
            })
            await Transac.deleteMany({});
        } else if (result == "move-right") {
            res.status(200).json({
                message: "Update Content success",
                move: result
            })
            await Transac.deleteMany({});
        } else if (result == "remove") {
            await Transac.deleteOne({ _id: data1wContent._id });
            await Transac.deleteOne({ _id: data2wContent._id });
            res.status(200).json({
                message: "Update Content success",
                remove: result
            })
            await Transac.deleteMany({});
        } else if (result == "read") {
            res.status(200).json({
                message: "Update Content success",
                remove: result,
                id: writing_note.note_id
            })
            await Transac.deleteMany({});
        } else if (result == "delete") {
            const datawri = writing_note.note_content;
            const len = writing_note.note_content.length - 2;
            writing_note.note_content = datawri.substring(0, len);
            await writing_note.save();
        }

    } catch (error) {
        console.error("Activate Error:", error);
        res.status(404).json({
            message: error.message,
            msg: msg
        });
    }

})

app.get('/get-reading', async(req, res) => {
    try {
        const reading_note = await Note.findOne({ note_writing: true });
        res.status(200).json({
            message: "get-reading complete",
            id: reading_note.note_id
        });
    } catch (error) {
        console.error("get-reading Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
});

//move left
app.put('/move-left', async(req, res) => {
    try {
        const ID = req.params.id;
        const writing_note = await Note.findOne({ note_writing: true });
        if (writing_note && writing_note.pos_reading != 0) {
            writing_note.pos_reading -= 1;
            await writing_note.save()
        }
        res.status(200).json({
            message: "move-left complete",
            pos: writing_note.pos_reading
        });
    } catch (error) {
        console.error("Move-left Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
});

//move right
app.put('/move-right', async(req, res) => {
    try {
        const ID = req.params.id;
        const writing_note = await Note.findOne({ note_writing: true });
        if (writing_note && writing_note.pos_reading < writing_note.note_content.length) {
            writing_note.pos_reading += 1;
            await writing_note.save()
        }
        res.status(200).json({
            message: "move-right complete",
            pos: writing_note.pos_reading
        });
    } catch (error) {
        console.error("Move-right Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
});

//Create Note
app.post('/create-note', async(req, res) => {
    try {
        const userData = req.body;

        if (!userData.note_title || !userData.note_id) {
            return res.status(400).json({ message: 'Note title and ID are required' });
        }

        const newNote = new Note({
            note_title: userData.note_title,
            note_content: userData.note_content,
            note_id: userData.note_id,
            note_writing: userData.note_writing,
            note_reading: userData.note_reading,
            pos_reading: userData.pos_reading
        })
        await newNote.save()
        res.json({
            newNote
        })
    } catch (error) {
        console.log("Create-Note Error:", error);
        res.status(400).json({
            message: error.message
        })
    }
})

//Read All Notes
app.get('/get-note', async(req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error("GetNote Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
});

//Read Specific Note
app.get('/get-specific-note/:id', async(req, res) => {
    try {
        const ID = req.params.id;
        const spec_note = await Note.findOne({ note_id: ID });

        if (!spec_note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(spec_note)
    } catch (error) {
        console.error("Get-Specfic Error: ", error);
        res.status(400).json({
            message: error.message
        })
    }
})

//Changing Status
app.patch('/writing-status/:id', async(req, res) => {
    try {
        const ID = req.params.id;
        const writing_note = await Note.findOne({ note_writing: true });
        if (writing_note) {
            writing_note.note_writing = false;
            await writing_note.save();
        }

        const spec_note = await Note.findOne({ note_id: ID });
        if (!spec_note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        spec_note.note_writing = true;
        await spec_note.save();

        res.status(200).json({
            message: "Writing status updated successfully!"
        });
    } catch (error) {
        console.error("Writing Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
});


//Reading Status
app.put('/reading-switch/:id', async(req, res) => {
    try {
        const ID = req.params.id;
        const reading_note = await Note.findOne({ note_id: ID });
        if (reading_note) {
            reading_note.note_writing = false;
            reading_note.note_reading = true;
            await reading_note.save();
            res.status(200).json({
                message: "Switch Success"
            })
        } else {
            throw new error("Cant get reading note");
        }
    } catch (error) {
        console.error("Status Error:", error);
        res.status(404).json({
            message: error.message
        })
    }
})

//Writing Status
app.put('/writing-switch/:id', async(req, res) => {
    try {
        const ID = req.params.id;
        const spec_note = await Note.findOne({ note_id: ID });
        if (spec_note) {
            spec_note.note_writing = true;
            spec_note.note_reading = false;
            await spec_note.save();
            res.status(200).json({
                message: "Switch Success"
            })
        } else {
            throw new error("Switch writing");
        }

    } catch (error) {
        console.error("Switch Error:", error);
        res.status(404).json({
            message: error.message
        })
    }
})

//Reset writing status when home page
app.patch('/reset-writing', async(req, res) => {
    try {
        const writing_note = await Note.findOne({ note_writing: true });
        if (writing_note) {
            writing_note.note_writing = false;
            await writing_note.save();
        }
        res.status(200).json({
            message: "Reset Successfully!"
        });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
})


app.delete('/delete-note/:id', async(req, res) => {
    try {
        const deletenote = req.params.id;
        await Note.deleteOne({ note_id: deletenote });
        res.status(200).json({
            message: "Delete Successfully!"
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
})

//Use Data from IOT to patch content value
app.put('/IOTinput', async(req, res) => {
    try {
        const msgdata = req.body.message;
        const writing_note = await Note.findOne({ note_writing: true });

        const braille = {
            "0001000000": "A",
            "0011000000": "B",
            "0001001000": "C",
            "0001001100": "D",
            "0001000100": "E",
            "0011001000": "F",
            "0011001100": "G",
            "0011000100": "H",
            "0010001000": "I",
            "0010001100": "J",
            "0001010000": "K",
            "0011010000": "L",
            "0001011000": "M",
            "0001011100": "N",
            "0001010100": "O",
            "0011011000": "P",
            "0011011100": "Q",
            "0011010100": "R",
            "0010011000": "S",
            "0010011100": "T",
            "0001010010": "U",
            "0011010010": "V",
            "0010001110": "W",
            "0001011010": "X",
            "0001011110": "Y",
            "0001010110": "Z"
        };
        const result = braille[msgdata];
        console.log(result);

        if (!result) {
            throw new error("Cant Match Result");
        }

        console.log(writing_note);
        if (writing_note) {
            writing_note.note_content = writing_note.note_content + result;
            await writing_note.save();
        }
        res.status(200).json({
            message: "Update Content success",
            respo: result
        })
    } catch (error) {
        console.error("Pull IOT Error:", error);
        res.status(400).json({
            message: error.message
        });
    }
})

//template insert
app.post('/template-insert', async(req, res) => {
    try {
        const userData = req.body;
        const NewData = new Datadb({
            msnger: userData.msnger,
        })
        await NewData.save()
        res.json({
            NewData
        })
    } catch (error) {
        console.log("Fetch Data Error :", error);
        res.status(400).json({
            message: error.message
        })
    }
})


//server
app.listen(5000, async() => {
    try {
        await mongoose.connect(mongoURL);
        console.log("server OK!");
    } catch (error) {
        console.log('Server fail', error);
    }
})