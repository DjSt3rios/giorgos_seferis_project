var Pages;
(function (Pages) {
    Pages["BIO"] = "Bio";
    Pages["PHOTOS"] = "Photos";
    Pages["BOOKS"] = "Books";
    Pages["LINKS"] = "Links";
    Pages["MANAGE"] = "Manage";
})(Pages || (Pages = {}));
let currentPage = Pages.BIO;
let category = 'index';
const leftMenu = document.querySelector('.aside');
const sections = Array.from(document.querySelectorAll('section'));
const subsections = Array.from(document.querySelectorAll('div[subcategory]'));
const bioSection = document.getElementById('Bio');
const photosSection = document.getElementById('Photos');
const booksSection = document.getElementById('Books');
const linksSection = document.getElementById('Links');
const manageSection = document.getElementById('Manage');
function rebuildLeftNavigation() {
    const children = leftMenu.querySelectorAll('div[page]');
    children.forEach((child) => {
        if (child.getAttribute('page') === currentPage) {
            child.classList.remove('d-none');
        }
        else {
            child.classList.add('d-none');
        }
    });
}
function addEvents() {
    const topBioButton = document.getElementById("navBio");
    const topPhotosButton = document.getElementById("navPhotos");
    const topBooksButton = document.getElementById("navBooks");
    const topLinksButton = document.getElementById("navLinks");
    const topManageButton = document.getElementById("navManage");
    topBioButton.addEventListener('click', () => {
        navButtonClicked(Pages.BIO);
    });
    topPhotosButton.addEventListener('click', () => {
        navButtonClicked(Pages.PHOTOS);
    });
    topBooksButton.addEventListener('click', () => {
        navButtonClicked(Pages.BOOKS);
    });
    topLinksButton.addEventListener('click', () => {
        navButtonClicked(Pages.LINKS);
    });
    topManageButton.addEventListener('click', () => {
        navButtonClicked(Pages.MANAGE);
    });
    const leftMenuItems = document.querySelectorAll('.side-menu-item');
    leftMenuItems.forEach((item) => {
        item.addEventListener('click', () => {
            leftMenuButtonClicked(item.id.split('-')[1]);
        });
    });
}
function navButtonClicked(page) {
    currentPage = page;
    category = 'index';
    rebuildLeftNavigation();
    updateMainContent();
}
function leftMenuButtonClicked(subcategory) {
    category = subcategory;
    updateMainContent();
}
function updateMainContent() {
    // Hide all sections
    sections.forEach((section) => {
        section.classList.add('d-none');
    });
    subsections.forEach((section) => {
        section.classList.add('d-none');
    });
    subsections.find((section) => section.getAttribute('subcategory') === category && section.parentElement.id === currentPage)?.classList.remove('d-none');
    let element;
    switch (currentPage) {
        case Pages.BIO:
            element = bioSection;
            break;
        case Pages.BOOKS:
            element = booksSection;
            break;
        case Pages.PHOTOS:
            element = photosSection;
            break;
        case Pages.LINKS:
            element = linksSection;
            break;
        case Pages.MANAGE:
            element = manageSection;
            break;
        default:
            break;
    }
    console.log('Element:', element);
    element?.classList.remove('d-none');
}
function onInit() {
    rebuildLeftNavigation();
    addEvents();
}
onInit();
//# sourceMappingURL=main.js.map