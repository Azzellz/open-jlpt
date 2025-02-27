<template>
    <div :class="type" />
</template>

<script lang="ts" setup>
import { random } from 'radash'
import { ref } from 'vue'
const type = ref('loader' + random(1, 6))
</script>

<style scoped>
.loader1 {
    width: 40px;
    aspect-ratio: 1;
    color: #f03355;
    position: relative;
    background: radial-gradient(10px, currentColor 94%, #0000);
}
.loader1:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
        radial-gradient(9px at bottom right, #0000 94%, currentColor) top left,
        radial-gradient(9px at bottom left, #0000 94%, currentColor) top right,
        radial-gradient(9px at top right, #0000 94%, currentColor) bottom left,
        radial-gradient(9px at top left, #0000 94%, currentColor) bottom right;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    animation: l18 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes l18 {
    33% {
        inset: -10px;
        transform: rotate(0deg);
    }
    66% {
        inset: -10px;
        transform: rotate(90deg);
    }
    100% {
        inset: 0;
        transform: rotate(90deg);
    }
}

.loader2 {
    width: 40px;
    aspect-ratio: 1;
    position: relative;
}
.loader2:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    --c: #0000, #f03355 1deg 120deg, #0000 121deg;
    background:
        conic-gradient(from 0deg, var(--c)) top right,
        conic-gradient(from 120deg, var(--c)) bottom,
        conic-gradient(from 240deg, var(--c)) top left;
    background-size: 40px 40px;
    background-repeat: no-repeat;
    animation: l25 2s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes l25 {
    33% {
        inset: -8px;
        transform: rotate(0deg);
    }
    66% {
        inset: -8px;
        transform: rotate(180deg);
    }
    100% {
        inset: 0;
        transform: rotate(180deg);
    }
}

.loader3 {
    width: 40px;
    aspect-ratio: 1;
    display: flex;
}
.loader3:before,
.loader3:after {
    content: '';
    flex: 1;
    background: #f03355;
    animation: l21 2s infinite;
    border-radius: 100px 0 0 100px;
    transform-origin: top right;
    transform: translateY(calc(var(--s, 1) * 0%)) rotate(0);
}
.loader3:after {
    transform-origin: bottom left;
    border-radius: 0 100px 100px 0;
    --s: -1;
}
@keyframes l21 {
    33% {
        transform: translate(0, calc(var(--s, 1) * 50%)) rotate(0);
    }
    66% {
        transform: translate(0, calc(var(--s, 1) * 50%)) rotate(-90deg);
    }
    90%,
    100% {
        transform: translate(calc(var(--s, 1) * -100%), calc(var(--s, 1) * 50%)) rotate(-90deg);
    }
}

.loader4 {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
}
.loader4:before,
.loader4:after {
    content: '';
    grid-area: 1/1;
    border-radius: 50%;
    background: #f03355;
    -webkit-mask: repeating-linear-gradient(#000 0 5px, #0000 0 10px);
    animation: l35 1.5s infinite;
}
.loader4:after {
    -webkit-mask: repeating-linear-gradient(#0000 0 5px, #000 0 10px);
    --s: -1;
}
@keyframes l35 {
    0%,
    10% {
        transform: translate(0) rotate(0);
    }
    35% {
        transform: translate(calc(var(--s, 1) * 50%)) rotate(0);
    }
    66% {
        transform: translate(calc(var(--s, 1) * 50%)) rotate(calc(var(--s, 1) * 180deg));
    }
    90%,
    100% {
        transform: translate(0) rotate(calc(var(--s, 1) * 180deg));
    }
}

.loader5 {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
}
.loader5:before,
.loader5:after {
    content: '';
    grid-area: 1/1;
    border-radius: 50%;
    background: #f03355;
    -webkit-mask: repeating-linear-gradient(#000 0 10px, #0000 0 20px);
}
.loader5:after {
    -webkit-mask: repeating-linear-gradient(#0000 0 10px, #000 0 20px);
    animation: l36 1.5s infinite;
}
@keyframes l36 {
    0%,
    10% {
        transform: rotate(0) translate(0);
    }
    35% {
        transform: rotate(0) translate(100%);
    }
    66% {
        transform: rotate(180deg) translate(100%);
    }
    90%,
    100% {
        transform: rotate(180deg) translate(0);
    }
}

.loader6 {
    width: 40px;
    aspect-ratio: 1;
    color: #f03355;
    background: conic-gradient(currentColor 0 270deg, #0000 0);
    border-radius: 50%;
    animation: l14-0 4s infinite linear;
}
.loader6::before {
    content: '';
    display: block;
    height: 50%;
    width: 50%;
    border-top-left-radius: 100px;
    background: currentColor;
    animation: l14 0.5s infinite alternate;
}
@keyframes l14-0 {
    0%,
    24.99% {
        transform: rotate(0deg);
    }
    25%,
    49.99% {
        transform: rotate(90deg);
    }
    50%,
    74.99% {
        transform: rotate(180deg);
    }
    75%,
    100% {
        transform: rotate(270deg);
    }
}
@keyframes l14 {
    100% {
        transform: translate(-10px, -10px);
    }
}
</style>
