import _Windows from "./js/class/_Windows.js";
import { DomBuilder } from "./js/utils/DomBuilder.js";
const dob = new DomBuilder();

//import _BorderListener from "./js/utils/BorderListener.js";

const enteteIconImage = new Image();
enteteIconImage.src = "./tmp_assets/enteteIcon.png";

enteteIconImage.onload = function () {

    const options = () => {
        return {
            width: 500,
            height: 400,
            x: Math.random() * 400,
            y: Math.random() * 400,
            gesture: true,
            //gesture: true,
            //headerHeight: 100,
            //minWidth: 75,
            //borderWidth: 5,
            //cornerSize: 10,
            entete: "hey",
            //maximizeTriggerArea: 15,
        };
    };

    const content = document.getElementById("win_content");

    _Windows.add({gesture: true});
    _Windows.add({gesture: true});
    _Windows.add({gesture: true});
    _Windows.add({gesture: true});
    _Windows.add({gesture: true});
    _Windows.add({gesture: true});

    _Windows.emitter.on('remove', ({detail}) => console.log(detail));

    console.log(_Windows.getAllWin());
    //console.log(_Windows.getAllWin());

};
