const { Schema, model } = require("mongoose");
const { DonnesCollection } = require("./modelsName");
module.exports=model(
    DonnesCollection,
    new Schema(
        {
            group_id:{type: Schema.Types.ObjectId,  required: true},
            note_groupe:{type:Number, default:20},
            abscence_moyen:{type:Number,  default:0},
            is_deleted:{type:Boolean,default:false},
            is_latest:{type:Boolean,default:true},
            date:{type:Date,default:Date.now}
        },
        { timestamps: true }

    )
)