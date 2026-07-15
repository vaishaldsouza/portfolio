import AboutMe from "../../app/markdown/aboutMe.mdx";
import Projects from "../../app/markdown/projects.mdx";
import Contact from "../../app/markdown/contact.mdx";
import Guide from "../../app/markdown/guide.mdx";
import RecycleBin from "../../app/markdown/recycleBin.mdx";
import Experience from "../../app/markdown/experience.mdx";
import Education from "../../app/markdown/education.mdx";

const memesFolder = require.context('../../public/memes', false);
const memesList = memesFolder.keys().map(img => img);

export const mainInterfaceItems = [
    {
        name: "My Computer",
        id: "myComputer",
        icon: "/windowsIcons/my-computer.svg",
        target: "Not Found",
        content: <Guide />,
    },
    {
        name: "Network Neighbourhood",
        id: "networkNeighbourhood",
        icon: "/windowsIcons/network-neighbourhood.svg",
        target: "Not Found",
        content: <Contact />,
    },
    {
        name: "Recycle Bin",
        id: "recycleBin",
        icon: "/windowsIcons/recycle-bin.svg",
        target: "Not Found",
        content: <RecycleBin />,
    },
    {
        name: "Naughty Stuff",
        id: "xxxvids",
        icon: "/windowsIcons/ie.svg",
        target: "vids",
        content: "Press any key or I'll show your search history to your parents 😈",
    },
    {
        name: "Meme Vault",
        id: "memes",
        icon: "/windowsIcons/troll-face.png",
        target: "dank",
        content: memesList,
    },
    {
        name: "About Me",
        id: "aboutMe",
        icon: "/windowsIcons/builder.png",
        target: "Wordpad",
        content: <AboutMe />,
    },
    {
        name: "Projects",
        id: "projects",
        icon: "/windowsIcons/joystick.png",
        target: "Wordpad",
        content: <Projects />,
    },
    {
        name: "Experience",
        id: "experience",
        icon: "/windowsIcons/documents.svg",
        target: "Wordpad",
        content: <Experience />,
    },
    {
        name: "Education",
        id: "education",
        icon: "/windowsIcons/folder.svg",
        target: "Wordpad",
        content: <Education />,
    },
    {
        name: "Talk to Me",
        id: "mail",
        icon: "/windowsIcons/chat.png",
        target: "Mail",
        content: "",
    },
    {
        name: "Download Résumé",
        id: "resume",
        icon: "/windowsIcons/resume.png",
        target: "system downloads",
        content: "",
    },
    {
        name: "Python IDE",
        id: "compiler",
        icon: "/windowsIcons/programs.png",
        target: "Compiler",
        content: "",
    },
    {
        name: "Chess",
        id: "chess",
        icon: "/windowsIcons/programs.png",
        target: "Chess",
        content: "",
    },
    {
        name: "MS Paint",
        id: "paint",
        icon: "/windowsIcons/wordpad.svg",
        target: "Paint",
        content: "",
    },
    {
        name: "Media Player",
        id: "music",
        icon: "/windowsIcons/programs.png",
        target: "Music",
        content: "",
    },
    {
        name: "Notepad",
        id: "notepad",
        icon: "/windowsIcons/wordpad.svg",
        target: "Notepad",
        content: "",
    },
];
