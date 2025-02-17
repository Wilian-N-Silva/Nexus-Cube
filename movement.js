const lenis = new Lenis({
    autoRaf: true,
});

window.addEventListener("DOMContentLoaded", (event) => {
    // SETUP PLUGINS
    gsap.registerPlugin(ScrollTrigger, Flip);
    //ScrollTrigger.normalizeScroll(true);

    // SETUP ELEMENTS
    let zoneEl = $("[js-scrollflip-element='zone']"),
        targetEl = $("[js-scrollflip-element='target']").first();

    // SETUP TIMELINE
    let tl;

    function createTimeline() {
        if (tl) {
            tl.kill();
            gsap.set(targetEl, { clearProps: "all" });
        }
        tl = gsap.timeline({
            scrollTrigger: {
                trigger: zoneEl.first(),
                start: "center center",
                endTrigger: zoneEl.last(),
                end: "center center",
                scrub: true,
                onUpdate: (self) => {
                    if (self.progress === 1) {
                        console.log("Última zone atingida!");
                    }
                }
            }
        });
        zoneEl.each(function (index) {
            let nextZoneEl = zoneEl.eq(index + 1);
            if (nextZoneEl.length) {
                let nextZoneDistance = nextZoneEl.offset().top + nextZoneEl.innerHeight() / 2;
                let thisZoneDistance = $(this).offset().top + $(this).innerHeight() / 2;
                let zoneDifference = nextZoneDistance - thisZoneDistance;
                tl.add(
                    Flip.fit(targetEl[0], nextZoneEl[0], {
                        duration: zoneDifference,
                        ease: "power2.inOut"
                    })
                );
            }
        });
    }
    createTimeline();

    // SETUP RESIZE
    let resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            createTimeline();
        }, 250);
    });
});