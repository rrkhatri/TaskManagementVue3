<script setup>
import {computed, defineEmits, defineProps} from "vue";

const props = defineProps({
  meta: {
    required: true,
    type: Object,
  },
  onEachSide: {
    default: 2,
    type: Number
  },
  class: {
    default: '',
    type: String,
    required: false
  }
})

const currentPage = defineModel('currentPage', {
  required: true,
  default: 1
});

const emit = defineEmits(['pageChanged'])

// const currentPage = computed(() => props.meta.current_page);
const lastPage = computed(() => props.meta.last_page);
const firstItem = computed(() => props.meta.from);
const lastItem = computed(() => props.meta.to);
const total = computed(() => props.meta.total);

const hasPages = computed(() => currentPage.value !== 1 || hasMorePages.value);
const onFirstPage = computed(() => currentPage.value <= 1);
const hasMorePages = computed(() => currentPage.value < lastPage.value);
const nextPage = computed(() => currentPage.value + 1)
const previousPage = computed(() => currentPage.value - 1)
const elements = computed(() => {
  let pages = [];
  if (lastPage.value < (props.onEachSide * 2) + 8) {
    pages = getSmallerSlider();
  } else {
    pages = getUrlSlider();
  }

  if (pages.slider && pages.slider.length > 1 && pages.first && pages.first.length > 1) {
    delete pages.first;
    return pages;
  }

  return pages;
})

const getSmallerSlider = () => {
  return {
    'first': getRange(1, lastPage.value),
    'slider': null,
    'last': null,
  }
}
const getUrlSlider = () => {
  let window = props.onEachSide;
  if (!hasPages.value) {
    return {
      'first': null,
      'slider': null,
      'last': null
    }
  }

  if (currentPage.value <= window) {
    return getSliderTooCloseToBeginning(window)
  }

  if (currentPage.value > (lastPage.value - window)) {
    return getSliderTooCloseToEnding(window);
  }

  return getFullSlider();
}
const getSliderTooCloseToBeginning = (window) => {
  return {
    'first': getRange(1, window + props.onEachSide),
    'slider': null,
    'last': getFinish(),
  }
}
const getSliderTooCloseToEnding = (window) => {
  let last = getRange(
      lastPage.value - (window + (props.onEachSide - 1)),
      lastPage.value
  );

  return {
    'first': getStart(),
    'slider': null,
    'last': last,
  }
}
const getFullSlider = () => {
  return {
    'first': getStart(),
    'slider': getAdjacentUrlRange(),
    'last': getFinish(),
  }
}
const getRange = (start, end) => {
  let range = [];
  while (end >= start) {
    range.push(start);
    start++;
  }

  return range;
}
const getFinish = () => {
  return getRange(lastPage.value - 1, lastPage.value);
}
const getStart = () => {
  return getRange(1, 2);
}
const getAdjacentUrlRange = () => {
  return getRange(
    currentPage.value - props.onEachSide,
    currentPage.value + props.onEachSide
  );
}

const paginate = (page) => {
  currentPage.value = page;
}
</script>

<template>
  <nav v-if="hasPages" role="navigation" aria-label="Pagination Navigation" :class="`flex items-center justify-between ${props.class}`">
    <div class="flex justify-between flex-1 sm:hidden">
      <span v-if="onFirstPage" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
         Previous
      </span>
      <a v-else @click="paginate(previousPage)" class="cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Previous
      </a>

      <a v-if="hasMorePages" @click="paginate(nextPage)" class="cursor-pointer relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Next
      </a>
      <span v-else class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
       Next
      </span>
    </div>

    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 leading-5">
          Showing
          <span class="font-medium">{{ firstItem }}</span>
          to
          <span class="font-medium">{{ lastItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>

      <div>
        <span class="relative z-0 inline-flex rtl:flex-row-reverse shadow-sm rounded-md">
          <span v-if="onFirstPage" aria-disabled="true" aria-label="Previous">
            <span
                class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default rounded-l-md leading-5"
                aria-hidden="true">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"/>
              </svg>
            </span>
          </span>
          <a v-else @click="paginate(previousPage)" rel="prev"
             class="cursor-pointer relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
             aria-label="Previous">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"/>
            </svg>
          </a>

          <template v-for="(element) in elements">
            <span v-if="typeof element === 'string'" aria-disabled="true">
              <span class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default leading-5">
                {{ element }}
              </span>
            </span>

            <template v-if="typeof element === 'object'" v-for="page in element" :key="page">
              <span v-if="currentPage === page" aria-current="page">
                <span class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-400 bg-white border border-gray-300 border-b-indigo-700 cursor-default leading-5">
                  {{ page }}
                </span>
              </span>

              <a
                  v-else
                  @click="paginate(page)"
                  class="cursor-pointer relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                  :aria-label="`Go to page ${page}`">
                  {{ page }}
              </a>
            </template>
          </template>

          <a
              v-if="hasMorePages"
              @click="paginate(nextPage)" rel="next"
              class="cursor-pointer relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              aria-label="Next">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"/>
            </svg>
          </a>
          <span v-else aria-disabled="true" aria-label="Next">
            <span
                class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default rounded-r-md leading-5"
                aria-hidden="true">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"/>
              </svg>
            </span>
          </span>
        </span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>
