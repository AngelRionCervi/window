import _Windows from "./js/class/_Windows.js";

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
            enteteIcon: enteteIconImage,
            //gesture: true,
            //headerHeight: 100,
            //minWidth: 75,
            //borderWidth: 5,
            //cornerSize: 10,
            entete: "la super fenetre lol",
            //maximizeTriggerArea: 15,
        };
    };

    const content = document.getElementById("win_content");

    _Windows.add(options(), content.cloneNode(true));
    _Windows.add(options(), content.cloneNode(true));
    _Windows.add(options(), content.cloneNode(true));
    _Windows.add(options(), content.cloneNode(true));
    _Windows.add(options(), content.cloneNode(true));
    _Windows.add(options(), content.cloneNode(true));
};
