import _Windows from "./js/class/_Windows.js";

//import _BorderListener from "./js/utils/BorderListener.js";

const options = () => {
    return {
        width: Math.random() * 800,
        height: Math.random() * 600,
        x: Math.random() * 400,
        y: Math.random() * 400,
        gesture: false,
        headerHeight: Math.random() * 100,
        minWidth: Math.random() * 200,
        borderWidth: Math.random() * 15,
        cornerSize: Math.random() * 50,
        entete: "lol",
        maximizeTriggerArea: 50,
    };
};

const content = document.getElementById("win_content");
console.log(content)

_Windows.add(options(), content.cloneNode(true));
_Windows.add(options(), content.cloneNode(true));
_Windows.add(options(), content.cloneNode(true));
_Windows.add(options(), content.cloneNode(true));
_Windows.add(options(), content.cloneNode(true));
_Windows.add(options(), content.cloneNode(true));


