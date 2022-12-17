import { getCookie, setCookie } from './cookies.js';
import { UserModel } from './models/user.model';

enum Pages {
  BIO = "Bio",
  PHOTOS = "Photos",
  BOOKS = "Books",
  LINKS = "Links",
  MANAGE = "Manage"
}

let currentPage: Pages = Pages.BIO;
let category = 'index';
const leftMenu: HTMLElement = document.querySelector('.aside');
const sections: HTMLElement[] = Array.from(document.querySelectorAll('section'));
const subsections: HTMLElement[] = Array.from(document.querySelectorAll('div[subcategory]'));
const bioSection: HTMLElement = document.getElementById('Bio');
const photosSection: HTMLElement = document.getElementById('Photos');
const booksSection: HTMLElement = document.getElementById('Books');
const linksSection: HTMLElement = document.getElementById('Links');
const manageSection: HTMLElement = document.getElementById('Manage');
const showRegisterBtn: HTMLElement = document.getElementById('showRegister');
const baseAPIUrl = "https://127.0.0.1/api/";
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
const loginError = document.getElementById('loginError');

const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;
const registerRepeatPassword = document.getElementById('registerRepeatPassword') as HTMLInputElement;
const registerButton = document.getElementById('registerButton') as HTMLButtonElement;
const registerError = document.getElementById('registerError');
function rebuildLeftNavigation() {
  const children = leftMenu.querySelectorAll('div[page]');
  children.forEach((child) => {
    if (currentPage === Pages.MANAGE) {
      if (child.getAttribute('page') === currentPage) {
        const subcategory = child.id.split('-')[1];
        if (subcategory === 'links' || subcategory === 'books')
        {
          if (isLoggedIn()) {
            child.classList.remove('d-none');
          }

        } else {
          child.classList.remove('d-none');
        }
      } else {
        child.classList.add('d-none');
      }
      return;
    }
    if (child.getAttribute('page') === currentPage) {
      child.classList.remove('d-none');
    } else {
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

  showRegisterBtn.addEventListener('click', () => {
    category = 'register';
    updateMainContent();
  });

  registerButton.addEventListener('click', () => {
    onRegisterClicked().then();
  });

  loginButton.addEventListener('click', () => {
    onLoginClicked().then();
  })
}

async function onLoginClicked() {
  const data: UserModel = {
    username: loginUsername?.value,
    password: loginPassword?.value,
  };
  const result = await fetchData('post', baseAPIUrl + "users/login", data).catch(() => null);
  if (result?.success) {
    const token = result?.accessToken;
    setCookie('access-token', token);
    rebuildLeftNavigation();
    category = 'index';
    updateMainContent();
  }
}

async function onRegisterClicked() {
  if (registerUsername.value.length < 1) {
    registerError.innerText = 'Please enter a valid username.';
    return;
  }
  if (registerPassword.value.length < 1) {
    registerError.innerText = 'Please enter a valid password.';
    return;
  }
  if (registerPassword.value !== registerRepeatPassword.value) {
    registerError.innerText = 'The two passwords you entered do not match.';
    return;
  }
  const data: UserModel = {
    username: registerUsername?.value,
    password: registerPassword?.value,
  };
  const result = await fetchData('post', baseAPIUrl + "users/new", data).catch(() => null);
  if (result?.success) {
    const token = result?.accessToken;
    setCookie('access-token', token);
    rebuildLeftNavigation();
    category = 'index';
    updateMainContent();
  }
}

function fetchData(method: string, url: string, data: Record<string, any>): Promise<Record<any, any>> {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, 'https://timeclock365.com/msteams/connector.php');
    xhr.setRequestHeader('access-token', getCookie("access_token"));

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (method.toLowerCase() === 'post') {
      if (Object.keys(data).length) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    } else {
      xhr.send();
    }
  });
}

function navButtonClicked(page: Pages) {
  currentPage = page;
  category = 'index';
  rebuildLeftNavigation();
  updateMainContent();
}

function leftMenuButtonClicked(subcategory: string) {
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
  if (currentPage === Pages.MANAGE && category === 'index' && !isLoggedIn()) {
    category = 'login';
  }
  subsections.find((section) => section.getAttribute('subcategory') === category && section.parentElement.id === currentPage)?.classList.remove('d-none');
  let element: HTMLElement;
  switch(currentPage) {
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
  element?.classList.remove('d-none');
}

function onInit()
{
  rebuildLeftNavigation();
  addEvents();
}

function isLoggedIn() {
  return !!getCookie("access-token");
}

onInit();
