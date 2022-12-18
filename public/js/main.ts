import { deleteCookie, getCookie, setCookie } from './cookies.js';
import { UserModel } from './models/user.model.js';
import { BookCategoryEnum, BookModel } from './models/book.model.js';
import { LinkCategoryEnum, LinkModel } from './models/link.model.js';

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
const baseAPIUrl = "api/";
const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
const loginError = document.getElementById('loginError');
const loginButtonText = document.getElementById('loginButtonText') as HTMLElement;

const registerUsername = document.getElementById('registerUsername') as HTMLInputElement;
const registerPassword = document.getElementById('registerPassword') as HTMLInputElement;
const registerRepeatPassword = document.getElementById('registerRepeatPassword') as HTMLInputElement;
const registerButton = document.getElementById('registerButton') as HTMLButtonElement;
const registerError = document.getElementById('registerError');
const registerButtonText = document.getElementById('registerButtonText') as HTMLElement;

const linkListGeneral = document.getElementById('linkListGeneral') as HTMLElement;
const linkListErt = document.getElementById('linkListErt') as HTMLElement;
const linkListManage = document.getElementById('linkListM') as HTMLElement;
const bookListGeneral = document.getElementById('bookListGeneral') as HTMLElement;
const bookListMyth = document.getElementById('bookListMyth') as HTMLElement;
const bookListDok = document.getElementById('bookListDok') as HTMLElement;
const bookListManage = document.getElementById('bookListM') as HTMLElement;
const linksWithData: HTMLElement[] = [linkListGeneral, linkListErt, linkListManage, bookListGeneral, bookListMyth, bookListDok, bookListManage];
const overlay = document.getElementById('overlay');
const bookData: { [id: number]: BookModel } = {};
const linkData: { [id: number]: LinkModel } = {};

function setButtonLoadingStatus(button: HTMLElement, loading = true)
{
  if (loading) {
    button.classList.add('d-none');
    button.parentElement.querySelector('.loading')?.classList.remove('d-none');
  } else {
    button.parentElement.querySelector('.loading')?.classList.add('d-none');
    button.classList.remove('d-none');
  }

}
function rebuildLeftNavigation() {
  const children = leftMenu.querySelectorAll('div[page]');
  children.forEach((child) => {
    if (currentPage === Pages.MANAGE) {
      console.log('CHild:', child);
      if (child.getAttribute('page') === currentPage) {
        const subcategory = child.id.split('-')[1];
        if (subcategory === 'links' || subcategory === 'books')
        {
          if (isLoggedIn()) {
            child.classList.remove('d-none');
          }
        } else if (child.id.includes('login') && isLoggedIn()) {
          child.classList.add('d-none');
        }  else if (child.id.includes('logout') && !isLoggedIn()) {
          child.classList.add('d-none');
        }
        else {
          child.classList.remove('d-none');
        }
      }  else {
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
      changeSubcategory(item.id.split('-')[1]);
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
  });

  document.getElementById('goManageBooks')?.addEventListener('click', () => {
    changeSubcategory('books')
  });
  document.getElementById('goManageLinks')?.addEventListener('click', () => {
    changeSubcategory('links');
  });
  overlay.addEventListener('click', (evt) => {
    if (evt.target === overlay) {
      closeModal();
    }
  });
  document.getElementById('newBook')?.addEventListener('click', () => {
    editBook();
  });
  document.getElementById('newLink')?.addEventListener('click', () => {
    editLink();
  });
}

function closeModal() {
  overlay.classList.add('d-none');
  overlay.innerHTML = "";
}

function openModal() {
  overlay.classList.remove('d-none');
}

function editBook(bookId?: number) {
  const frag = document.createRange().createContextualFragment(document.getElementById('editBookModalTemplate').innerHTML);
  if(bookId) {
    const bookIdInput = frag.querySelector('#bookId') as HTMLInputElement;
    bookIdInput.value = String(bookId);
    const bookTitleInput = frag.querySelector('#bookTitle') as HTMLInputElement;
    bookTitleInput.value = bookData[bookId]?.title;
    const bookYearInput = frag.querySelector('#bookYear') as HTMLInputElement;
    bookYearInput.value = String(bookData[bookId]?.year);
    const bookYearType = frag.querySelector('#bookType') as HTMLSelectElement;
    bookYearType.value = String(bookData[bookId]?.category).toUpperCase();
  }
  overlay.appendChild(frag);
  overlay.querySelector('#saveButton').addEventListener('click', () => {
    const id = overlay.querySelector('#bookId') as HTMLInputElement;
    const titleInput = overlay.querySelector('#bookTitle') as HTMLInputElement;
    const yearInput = overlay.querySelector('#bookYear') as HTMLInputElement;
    const yearType = overlay.querySelector('#bookType') as HTMLSelectElement;
    if (!titleInput.value.length || !yearInput.value.length) {
      setSaveError('Please fill all fields.');
      return;
    }
    setSaveError();
    saveBook({
      id: id.value.length ? +id.value : undefined,
      title: titleInput.value,
      year: +yearInput.value,
      category: yearType.value === 'DOK' ? BookCategoryEnum.DOK : BookCategoryEnum.MYTH,
    }).then();
  });
  openModal();
}

function editLink(linkId?: number) {
  const frag = document.createRange().createContextualFragment(document.getElementById('editLinkModalTemplate').innerHTML);
  if(linkId) {
    const linkIdInput = frag.querySelector('#linkId') as HTMLInputElement;
    linkIdInput.value = String(linkId);
    const linkLinkInput = frag.querySelector('#linkLink') as HTMLInputElement;
    linkLinkInput.value = linkData[linkId]?.link;
    const linkAdditionalInfo = frag.querySelector('#linkAdditionalInfo') as HTMLInputElement;
    linkAdditionalInfo.value = String(linkData[linkId]?.additionalInfo);
    const linkCategoryInput = frag.querySelector('#linkType') as HTMLSelectElement;
    linkCategoryInput.value = String(linkData[linkId]?.category).toUpperCase();
  }
  overlay.appendChild(frag);
  overlay.querySelector('#saveButton').addEventListener('click', () => {
    const id = overlay.querySelector('#linkId') as HTMLInputElement;
    const linkInput = overlay.querySelector('#linkLink') as HTMLInputElement;
    const additionalInfoInput = overlay.querySelector('#linkAdditionalInfo') as HTMLInputElement;
    const linkType = overlay.querySelector('#linkType') as HTMLSelectElement;
    if (!linkInput.value.length) {
      setSaveError('Link field is required.');
      return;
    }
    setSaveError();
    saveLink({
      id: id.value.length ? +id.value : undefined,
      link: linkInput.value,
      additionalInfo: additionalInfoInput.value,
      category: linkType.value === 'GENERAL' ? LinkCategoryEnum.GENERAL : LinkCategoryEnum.ERT,
    }).then();
  });
  openModal();
}

async function onLoginClicked() {
  if (loginUsername.value.length < 1) {
    setLoginError('Please enter a valid username.');
    return;
  }
  if (loginPassword.value.length < 1) {
    setLoginError('Please enter a valid password.');
    return;
  }
  setButtonLoadingStatus(loginButtonText);
  const data: UserModel = {
    username: loginUsername?.value,
    password: loginPassword?.value,
  };
  const result = JSON.parse(await apiCall('POST', baseAPIUrl + "users/login", data).catch((err) => { console.log(err); return null }));
  setButtonLoadingStatus(loginButtonText, false);
  if (result?.success) {
    setLoginError();
    const token = result?.accessToken;
    setCookie('access_token', token, {
      expires: new Date(2024,1,1)
    });
    rebuildLeftNavigation();
    category = 'index';
    updateMainContent();
  } else {
    console.log('Result:', result);
    if (result?.message) {
      setLoginError(result.message);
    } else {
      setLoginError("An error has occurred. Please try again.");
    }
  }
}

async function onRegisterClicked() {
  if (registerUsername.value.length < 1) {
    setRegisterError('Please enter a valid username.');
    return;
  }
  if (registerPassword.value.length < 1) {
    setRegisterError('Please enter a valid password.');
    return;
  }
  if (registerPassword.value !== registerRepeatPassword.value) {
    setRegisterError('The two passwords you entered do not match.');
    return;
  }
  setButtonLoadingStatus(registerButtonText);
  const data: UserModel = {
    username: registerUsername?.value,
    password: registerPassword?.value,
  };
  const result = JSON.parse(await apiCall('post', baseAPIUrl + "users/new", data).catch(() => null));
  setButtonLoadingStatus(registerButtonText, false);
  if (result?.success) {
    setRegisterError();
    const token = result?.accessToken;
    setCookie('access_token', token, {
      expires: new Date(2024,1,1)
    });
    rebuildLeftNavigation();
    category = 'index';
    updateMainContent();
  } else {
    if (result?.message) {
      setRegisterError(result.message);
    } else {
      setRegisterError("An error has occurred. Please try again.");
    }
  }
}

function setRegisterError(text?: string) {
  if (text) {
    registerError.innerText = text;
    registerError.classList.remove('d-none');
  } else {
    registerError.innerText = "";
    registerError.classList.add('d-none');
  }
}

function setLoginError(text?: string) {
  if (text) {
    loginError.innerText = text;
    loginError.classList.remove('d-none');
  } else {
    loginError.innerText = "";
    loginError.classList.add('d-none');
  }
}

function setSaveError(text?: string) {
  const textElement = overlay.querySelector('#saveError') as HTMLElement;
  if (text) {
    textElement.innerText = text;
    textElement.classList.remove('d-none');
  } else {
    textElement.innerText = "";
    textElement.classList.add('d-none');
  }
}

function apiCall(method: string, url: string, data: Record<string, any>): Promise<Record<any, any>> {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    if (getCookie("access_token")) {
      xhr.setRequestHeader('access-token', getCookie("access_token"));
    }

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
    if (method.toLowerCase() === 'post' || method.toLowerCase() === 'patch') {
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

function changeSubcategory(subcategory: string) {
  if (currentPage === Pages.MANAGE && subcategory === 'logout') {
    subcategory = 'login';
    deleteCookie('access_token');
    rebuildLeftNavigation();
  }
  category = subcategory;
  updateMainContent();
}

async function deleteBook(id: number) {
  const result = await apiCall("DELETE",baseAPIUrl + `books/${id}`, {});
  console.log('Delete result:', result);
}

async function deleteLink(id: number) {
  const result = await apiCall("DELETE",baseAPIUrl + `links/${id}`, {});
  console.log('Delete result:', result);
}

async function saveBook(bookData: BookModel) {
  setButtonLoadingStatus(overlay.querySelector('#saveButton'), true);
  const result = JSON.parse(await apiCall(bookData.id ? 'PATCH' : 'POST', baseAPIUrl + `books/${bookData?.id ? bookData.id.toString() : 'new'}`, bookData).catch(() => null));
  if (result?.success) {
    closeModal();
    updateMainContent();
  } else {
    setButtonLoadingStatus(overlay.querySelector('#saveButton'), false);
    if (result?.message) {
      setSaveError(result.message);
    } else {
      setSaveError('An unknown error has occurred. Please try again.');
    }
  }
}

async function saveLink(linkData: LinkModel) {
  setButtonLoadingStatus(overlay.querySelector('#saveButton'), true);
  const result = JSON.parse(await apiCall(linkData.id ? 'PATCH' : 'POST', baseAPIUrl + `links/${linkData?.id ? linkData.id.toString() : 'new'}`, linkData).catch(() => null));
  if (result?.success) {
    closeModal();
    updateMainContent();
  } else {
    setButtonLoadingStatus(overlay.querySelector('#saveButton'), false);
    if (result?.message) {
      setSaveError(result.message);
    } else {
      setSaveError('An unknown error has occurred. Please try again.');
    }
  }
}

function updateMainContent() {
  // Clear errors on register/login page
  setRegisterError();
  setLoginError();
  // Clear lists of data
  linksWithData.forEach((link) => {
    link.innerHTML = "";
  });
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
      switch(category) {
        case 'index':
          getBooks().then((results: { data: BookModel[] }) => {
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              bookListGeneral.insertAdjacentHTML('beforeend', `<div class="book-item mt-3">${result.title} (${result.year})</div>`);
            }
          });
          break;
        case 'dok':
          getBooks({ category: BookCategoryEnum.DOK }).then((results: { data: BookModel[] }) => {
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              bookListDok.insertAdjacentHTML('beforeend', `<div class="book-item mt-3">${result.title} (${result.year})</div>`);
            }
          });
          break;
        case 'myth':
          getBooks({ category: BookCategoryEnum.MYTH }).then((results: { data: BookModel[] }) => {
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              bookListMyth.insertAdjacentHTML('beforeend', `<div class="book-item mt-3">${result.title} (${result.year})</div>`);
            }
          });
          break;
        default:
          break;
      }
      break;
    case Pages.PHOTOS:
      element = photosSection;
      break;
    case Pages.LINKS:
      element = linksSection;
      switch(category) {
        case 'index':
          getLinks().then((results: { data: LinkModel[] }) => {
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              linkListGeneral.insertAdjacentHTML('beforeend', `<div class="link-item mt-3"><a href="${result.link}">${result.link}</a> (${result.additionalInfo})</div>`);
            }
          });
          break;
        case 'ert':
          getLinks({ category: LinkCategoryEnum.ERT }).then((results: { data: LinkModel[] }) => {
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              linkListErt.insertAdjacentHTML('beforeend', `<div class="link-item mt-3"><a href="${result.link}">${result.link}</a> (${result.additionalInfo})</div>`);
            }
          });
          break;
        default:
          break;
      }
      break;
    case Pages.MANAGE:
      element = manageSection;
      switch(category) {
        case 'books':
          getBooks().then((results: { data: BookModel[] }) => {
            clearObject(bookData);
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              bookData[result.id] = result;
              bookListManage.insertAdjacentHTML('beforeend', `<div class="link-item mt-3">${result.title} (${result.year}) <button class="btn" id="editbook${result.id}">Edit</button> <button class="btn" id="book${result.id}">Delete</button> </div>`);
              const deleteButton = bookListManage.querySelector(`#book${result.id}`);
              deleteButton.addEventListener('click', () => {
                deleteBook(result.id).then(() => {
                  deleteButton.parentElement.remove();
                  delete bookData[result.id];
                });
              });
              const editButton = bookListManage.querySelector(`#editbook${result.id}`);
              editButton.addEventListener('click', () => {
                editBook(result.id);
              });
            }
          });
          break;
        case 'links':
          getLinks().then((results: { data: LinkModel[] }) => {
            clearObject(linkData);
            results = JSON.parse(results as unknown as string);
            for (const result of results?.data) {
              linkData[result.id] = result;
              linkListManage.insertAdjacentHTML('beforeend', `<div class="link-item mt-3"><a href="${result.link}">${result.link}</a> (${result.additionalInfo}) <button class="btn" id="editlink${result.id}">Edit</button> <button class="btn" id="link${result.id}">Delete</button> </div>`);
              const deleteButton = linkListManage.querySelector(`#link${result.id}`);
              deleteButton.addEventListener('click', () => {
                deleteLink(result.id).then(() => {
                  deleteButton.parentElement.remove();
                });
              });
              const editButton = linkListManage.querySelector(`#editlink${result.id}`);
              editButton.addEventListener('click', () => {
                editLink(result.id);
              });
            }
          });
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  element?.classList.remove('d-none');
}

function clearObject(object: Record<any, any>) {
  if(object && typeof object === 'object') {
    for (const objectKey in object) {
      delete object[objectKey];
    }
  }
}

async function getBooks(filter: BookModel = {} as BookModel) {
  return await apiCall("POST",baseAPIUrl + `books/search`, filter);
}

async function getLinks(filter: LinkModel = {} as LinkModel) {
  return await apiCall("POST",baseAPIUrl + `links/search`, filter);
}

function onInit()
{
  rebuildLeftNavigation();
  addEvents();
}

function isLoggedIn() {
  return !!getCookie("access_token");
}

onInit();
