'use strict';
import './sass/main.scss';
import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';

const $form = document.querySelector('#search-form');
const $formInput = $form.firstElementChild;
const $formBtn = $form.lastElementChild;
const $gallery = document.querySelector('div.gallery');
const $loadMoreBtn = document.querySelector('button.load-more');

let pageNumber = 1;
const getImages = pageNumber => {
  return axios.get(`https://pixabay.com/api/?key=26547468-c672cf1e6b76e928b73769e65&q=${$formInput.dataset.value}
    &image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
};

$formInput.addEventListener('input', ev => {
  const searchValue = ev.target.value
      .split(" ")
      .join("+");
  $formInput.setAttribute('data-value', searchValue);
});

$formBtn.addEventListener('click', async ev => {
  ev.preventDefault();
  pageNumber = 1;
  await getImages(pageNumber).then(response => {
    if (response.data.hits.length === 0) {
      const $galleryItems = document.querySelectorAll('div.photo-card');
      for (const $galleryItem of $galleryItems) {
        $galleryItem.remove();
      }
      $loadMoreBtn.classList.add("hidden");
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      const $galleryItems = document.querySelectorAll('div.photo-card');
      for (const $galleryItem of $galleryItems) {
        $galleryItem.remove();
      }
      let markup = response.data.hits
        .map(
          image =>
            `<div class="photo-card">
            <img class="card__img " src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${image.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
              </p>
            </div>
          </div>`,
        )
        .join('');
      $gallery.lastElementChild.insertAdjacentHTML('beforebegin', markup);
      $loadMoreBtn.classList.remove('hidden');

      $loadMoreBtn.addEventListener('click', async () => {
        pageNumber += 1;
        $loadMoreBtn.classList.add("hidden");
        await getImages(pageNumber).then(response => {
          if(response.data.totalHits === $gallery.children.length-1){
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
          }
          markup = response.data.hits
            .map(
              image =>
                `<div class="photo-card">
            <img class="card__img " src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${image.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
              </p>
            </div>
          </div>`,
            )
            .join('');
          $gallery.lastElementChild.insertAdjacentHTML('beforebegin', markup);
          $loadMoreBtn.classList.remove("hidden");
        });
      });
    }
  });
});
