<template>
  <div class="flex items-center space-x-4 py-2">
    <!-- Gear Image -->
    <div class="ml-2 shrink-0">
      <img :src="gear.image.url" class="h-20 w-20" />
    </div>

    <!-- Details -->
    <div class="grow min-w-0 flex flex-col justify-evenly space-y-2">
      <div class="flex">
        <div class="inline-block text-xs bg-zinc-200 bg-opacity-30 rounded px-1 py-px font-semibold">
          {{ formatShortDurationFromNow(props.gear.saleEndTime) }}
          left
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <div class="bg-white h-6 aspect-square rounded">
          <img :src="gear.brand.image.url" :title="gear.brand.name" />
        </div>

        <div class="flex-1 font-splatoon2 text-shadow overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ gear.name }}
        </div>
      </div>

      <div class="flex items-center space-x-px">
        <div :title="gear.primaryGearPower.name" class="bg-black rounded-full">
          <img :src="gear.primaryGearPower.image.url" class="h-8" />
        </div>

        <div v-for="(power, i) in gear.additionalGearPowers" :key="i" :title="power.name" class="bg-black rounded-full">
          <img :src="power.image.url" class="h-6" />
        </div>
      </div>
    </div>

    <!-- Price/Order button -->
    <div class="flex-none flex flex-col self-stretch items-end">
      <div class="flex-1">
        <div class="hidden mobile:block">
          <a :href="shopUrl">
            <SquidTape
              class="font-splatoon2 text-sm text-black rounded-sm -rotate-2"
              bg="bg-splatoon-yellow"
              squidBg="bg-black"
              border="border border-black"
              >
              <div class="px-1">
                Order
              </div>
            </SquidTape>
          </a>
        </div>
      </div>

      <div class="flex items-center space-x-2 bg-price w-28 pl-2 -mr-px">
        <div>
          <img src="@/assets/img/gesotown-coin.svg" />
        </div>
        <div class="font-splatoon1">
          {{ price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import SquidTape from '../SquidTape.vue';
import { getGesotownGearUrl } from '@/common/links';
import { formatShortDurationFromNow } from '../../common/time';

const props = defineProps({
  gear: Object,
});

const price = computed(() => props.gear.price);
const gear = computed(() => props.gear.gear);

const shopUrl = computed(() => getGesotownGearUrl(props.gear.id));
</script>

<style scoped>
.bg-price {
  background-image: url('@/assets/img/gesotown-price-bg.png');
  background-repeat: no-repeat;
  background-size: 120px 31px;
  background-position: left;
}
</style>