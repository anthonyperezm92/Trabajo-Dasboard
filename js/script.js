const App = (()=>{
    "use strict";
    function e(e, t) {
        const o = [window.innerWidth];
        return window.addEventListener("resize", (()=>{
            const s = o.length;
            o.push(window.innerWidth),
            o[s] !== o[s - 1] && (clearTimeout(t),
            t = setTimeout(e, 150))
        }
        )),
        e
    }
    function t(e) {
        let t, o, s;
        switch (e) {
        case "xs":
            s = "d-none d-sm-block";
            break;
        case "sm":
            s = "d-block d-sm-none d-md-block";
            break;
        case "md":
            s = "d-block d-md-none d-lg-block";
            break;
        case "lg":
            s = "d-block d-lg-none d-xl-block";
            break;
        case "xl":
            s = "d-block d-xl-none";
            break;
        case "smDown":
            s = "d-none d-md-block";
            break;
        case "mdDown":
            s = "d-none d-lg-block";
            break;
        case "lgDown":
            s = "d-none d-xl-block";
            break;
        case "smUp":
            s = "d-block d-sm-none";
            break;
        case "mdUp":
            s = "d-block d-md-none";
            break;
        case "lgUp":
            s = "d-block d-lg-none"
        }
        return t = document.createElement("div"),
        t.setAttribute("class", s),
        document.body.appendChild(t),
        o = null === t.offsetParent,
        t.parentNode.removeChild(t),
        o
    }
    function o() {
        return t("lgUp")
    }
    let s = .01 * window.innerHeight;
    return document.documentElement.style.setProperty("--vh", s + "px"),
    window.addEventListener("resize", (()=>{
        let e = .01 * window.innerHeight;
        document.documentElement.style.setProperty("--vh", e + "px")
    }
    )),
    {
        resize: t=>e(t),
        xs: ()=>t("xs"),
        sm: ()=>t("sm"),
        md: ()=>t("md"),
        lg: ()=>t("lg"),
        xl: ()=>t("xl"),
        smDown: ()=>t("smDown"),
        mdDown: ()=>t("mdDown"),
        lgDown: ()=>t("lgDown"),
        smUp: ()=>t("smUp"),
        mdUp: ()=>t("mdUp"),
        lgUp: ()=>o(),
        treeview: ()=>{
            document.addEventListener("click", (e=>{
                if (e.target.closest(".treeview-toggle")) {
                    const t = e.target.closest(".treeview-toggle")
                      , o = t.closest("ul")
                      , s = t.closest(".treeview");
                    void 0 !== o.dataset.accordion && o.querySelectorAll(":scope > li > .show").forEach((e=>t != e && e.classList.remove("show"))),
                    t.classList.toggle("show");
                    const n = t.classList.contains("show") ? "treeview:shown" : "treeview:hidden";
                    t.dispatchEvent(new Event(n)),
                    s.dispatchEvent(new Event("treeview:updated")),
                    e.preventDefault()
                }
            }
            ))
        }
        ,
        toggleSidebar: ()=>(document.addEventListener("click", (e=>{
            e.target.closest('[data-toggle="sidebar"]') && (o() ? document.body.classList.toggle("sidebar-collapse") : document.body.classList.toggle("sidebar-expand"),
            document.querySelector(".sidebar-body").scrollTop = 0,
            window.dispatchEvent(new Event("resize")),
            e.preventDefault())
        }
        )),
        void function() {
            document.body.insertAdjacentHTML("beforeend", '<div class="sidebar-backdrop" id="sidebarBackdrop" data-toggle="sidebar"></div>');
            const e = document.querySelector(".sidebar-2");
            if (e) {
                const t = e.querySelector(".sidebar-body");
                let s = document.body.classList
                  , n = 0
                  , a = !1;
                t.addEventListener("scroll", (function() {
                    !a && (n = this.scrollTop)
                }
                )),
                document.addEventListener("click", (e=>{
                    e.target.closest('[data-toggle="sidebar"]') && (s.contains("sidebar-collapse") && !s.contains("sidebar-expand") || (t.scrollTop = n))
                }
                )),
                e.addEventListener("mouseenter", (()=>{
                    s.contains("sidebar-collapse") && o() && (a = !1,
                    t.scrollTop = n)
                }
                )),
                e.addEventListener("mouseleave", (()=>{
                    s.contains("sidebar-collapse") && o() && (a = !0,
                    t.scrollTop = 0)
                }
                ))
            }
        }()),
        // sidebarBodyCustomScrollBar: ()=>{
            // new SimpleBar(document.querySelector(".sidebar .sidebar-body"))
        // }
        // ,
        autofocusModal: ()=>{
            $(document).on("shown.bs.modal", ".modal", (function() {
                const e = this.querySelector("[autofocus]");
                e && e.focus()
            }
            ))
        }
        ,
        color: e=>getComputedStyle(document.body).getPropertyValue("--" + e).trim(),
        customFileInput: ()=>{
            document.addEventListener("change", (e=>{
                if (e.target.closest(".custom-file-input")) {
                    const t = e.target.closest(".custom-file-input")
                      , o = t.dataset.choose ? t.dataset.choose : t.nextElementSibling.innerText;
                    !t.dataset.choose && (t.dataset.choose = o);
                    const s = t.files.length;
                    let n = s ? t.files[0].name : o;
                    n = s > 1 ? s + " files" : n,
                    t.parentElement.querySelector("label").textContent = n
                }
            }
            ))
        }
        ,
        cardToolbar: ()=>{
            document.addEventListener("click", (e=>{
                if (e.target.closest("[data-action]")) {
                    const t = e.target.closest("[data-action]")
                      , o = t.closest(".card");
                    switch (t.dataset.action) {
                    case "fullscreen":
                        o.classList.toggle("card-fullscreen"),
                        o.classList.contains("card-fullscreen") ? (t.innerHTML = '<i class="material-icons">fullscreen_exit</i>',
                        document.body.style.overflow = "hidden") : (t.innerHTML = '<i class="material-icons">fullscreen</i>',
                        document.body.removeAttribute("style"));
                        break;
                    case "close":
                        o.remove();
                        break;
                    case "reload":
                        o.insertAdjacentHTML("afterbegin", '<div class="card-loader-overlay"><div class="spinner-border text-white" role="status"></div></div>'),
                        o.dispatchEvent(new Event("card:reload"));
                        break;
                    case "collapse":
                        const e = 1e3 * parseFloat(getComputedStyle(document.querySelector(".collapsing")).transitionDuration);
                        setTimeout((()=>{
                            document.querySelector(t.dataset.target).matches(".collapse.show") ? t.innerHTML = '<i class="material-icons">remove</i>' : t.innerHTML = '<i class="material-icons">add</i>'
                        }
                        ), e)
                    }
                }
            }
            ))
        }
        ,
        stopCardLoader: e=>{
            let t = e.querySelector(".card-loader-overlay");
            t.parentNode.removeChild(t)
        }
        ,
        navSection: ()=>(document.querySelector("#navSection") && ($("body").scrollspy("dispose"),
        $("body").scrollspy({
            target: "#navSection",
            offset: 140
        })),
        void document.addEventListener("click", (e=>{
            if (e.target.closest("#navSection")) {
                const t = document.querySelector(e.target.getAttribute("href")).getBoundingClientRect().top + window.pageYOffset - ((document.body.dataset.offset || 140) - 1);
                window.scrollTo({
                    top: t,
                    behavior: "smooth"
                }),
                e.preventDefault()
            }
        }
        ))),
        accordionActive: ()=>($(".collapse.show[data-parent]").closest(".card").addClass("active"),
        void $(document).on("show.bs.collapse", ".collapse[data-parent]", (function() {
            $(this).closest(".card").addClass("active")
        }
        )).on("hide.bs.collapse", ".collapse[data-parent]", (function() {
            $(this).closest(".card").removeClass("active")
        }
        ))),
        dropdownHover: ()=>{
            document.addEventListener("mouseover", (e=>{
                o() && (e.target.closest(".dropdown-hover") ? ($(".dropdown-hover").removeClass("show"),
                e.target.closest(".dropdown-hover").classList.add("show")) : $(".dropdown-hover").removeClass("show"))
            }
            ))
        }
        ,
        checkAll: ()=>function() {
            if (document.querySelectorAll(".has-checkAll").length) {
                const t = "table-active";
                for (const o of document.querySelectorAll(".has-checkAll")) {
                    const s = o.querySelector('th input[type="checkbox"]')
                      , n = o.querySelectorAll('tr > td:first-child input[type="checkbox"]')
                      , a = o.dataset.bulkTarget;
                    let r = o.dataset.checkedClass;
                    r = r || t,
                    s.addEventListener("click", (function() {
                        for (const e of n)
                            e.checked = this.checked,
                            e.checked ? e.closest("tr").classList.add(r) : e.closest("tr").classList.remove(r);
                        a && e(a, n)
                    }
                    ));
                    for (const t of n)
                        t.addEventListener("click", (function() {
                            this.checked ? this.closest("tr").classList.add(r) : this.closest("tr").classList.remove(r),
                            a && e(a, n)
                        }
                        ))
                }
                function e(e, t) {
                    let o = 0;
                    const s = document.querySelector(e);
                    t.forEach((e=>e.checked && o++)),
                    s.querySelector(".checked-counter") && (s.querySelector(".checked-counter").textContent = o),
                    0 != o ? s.removeAttribute("hidden") : s.setAttribute("hidden", "")
                }
            }
        }(),
        backgroundCover: ()=>{
            document.querySelectorAll("[data-cover]").forEach((e=>e.style.backgroundImage = `url(${e.dataset.cover})`))
        }
        ,
        innerToggleSidebar: ()=>{
            document.addEventListener("click", (e=>{
                if (e.target.closest('[data-toggle="inner-sidebar"]')) {
                    const t = e.target.closest('[data-toggle="inner-sidebar"]')
                      , o = document.body;
                    o.classList.toggle("inner-expand"),
                    o.classList.contains("inner-expand") ? t.innerHTML = '<i class="material-icons">close</i>' : t.innerHTML = '<i class="material-icons">arrow_forward_ios</i>',
                    e.preventDefault()
                }
            }
            ))
        }
        ,
        scrollNavbar: ()=>function() {
            if (document.querySelector(".main-navbar")) {
                const t = document.querySelector(".main-navbar .navbar-collapse");
                setTimeout((()=>{
                    e((()=>{
                        if (o())
                            for (const e of document.querySelectorAll("[data-scroll]"))
                                t.querySelector(".navbar-nav").getBoundingClientRect().width > t.getBoundingClientRect().width ? e.removeAttribute("hidden") : e.setAttribute("hidden", "")
                    }
                    ))()
                }
                ), 500);
                for (const e of document.querySelectorAll("[data-scroll]"))
                    e.addEventListener("click", (o=>{
                        let s = t.getBoundingClientRect().width / 2;
                        switch (e.dataset.scroll) {
                        case "left":
                            t.scrollLeft -= s;
                            break;
                        case "right":
                            t.scrollLeft += s
                        }
                        o.preventDefault()
                    }
                    ));
                $(".main-navbar .dropdown").on("show.bs.dropdown", (function() {
                    let e = document.querySelector(".main-navbar .navbar-collapse").scrollLeft;
                    this.querySelector(".dropdown-menu").style.marginLeft = -e + "px"
                }
                ))
            }
        }(),
        featherIcon: ()=>function() {
            feather.replace();
            const e = new MutationObserver((()=>feather.replace()));
            e.observe(document.querySelector(".main"), {
                childList: !0,
                subtree: !0
            }),
            e.observe(document.querySelector(".sidebar"), {
                childList: !0,
                subtree: !0
            })
        }(),
        todo: ()=>{
            document.addEventListener("click", (e=>{
                if (e.target.closest('[data-toggle="todo-item"]')) {
                    const t = e.target.closest('[data-toggle="todo-item"]')
                      , o = t.closest(".todo-item");
                    t.checked ? o.classList.add("done") : o.classList.remove("done")
                }
            }
            ))
        }
        ,
        fixFlatpickr: ()=>{
            document.addEventListener("wheel", (function() {
                document.activeElement.classList.contains("cur-year") && document.activeElement.blur()
            }
            ))
        }
        ,
        summernoteFocus: ()=>{
            $(document).on("summernote.focus", ".summernote", (function() {
                $(this).next().addClass("focus")
            }
            )).on("summernote.blur", ".summernote", (function() {
                $(this).next().removeClass("focus")
            }
            ))
        }
        ,
        toast: e=>function(e) {
            const t = void 0 !== e.animation ? e.animation : "true"
              , o = void 0 !== e.autohide ? e.autohide : "true"
              , s = void 0 !== e.position ? e.position : "top-right"
              , n = ".toast-wrapper." + s
              , a = void 0 !== e.delay ? e.delay : 2e3
              , r = "toast" + Date.now();
            let c = "";
            switch (e.icon) {
            case "success":
                c = '<svg class="mr-2 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="21" height="21"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                break;
            case "warning":
                c = '<svg class="mr-2 text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="21" height="21"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
                break;
            case "error":
                c = '<svg class="mr-2 text-danger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="21" height="21"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
                break;
            default:
                c = '<svg class="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="21" height="21"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>'
            }
            const l = `\n      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${r}" data-autohide="${o}" data-animation="${t}" data-delay="${a}">\n        <div class="toast-header">\n          ${c}\n          <strong>${e.title}</strong>\n          <button type="button" class="close ml-auto" data-dismiss="toast" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n          </button>\n        </div>\n        <div class="toast-body">${e.text}</div>\n      </div>\n    `;
            document.querySelector(n) || document.body.insertAdjacentHTML("beforeend", `<div class="toast-wrapper ${s}"></div>`),
            document.querySelector(n).insertAdjacentHTML("beforeend", l),
            $("#" + r).toast("show"),
            $("#" + r).on("hidden.bs.toast", (function() {
                this.remove(),
                document.querySelectorAll(n + " .toast").length < 1 && document.querySelector(n).remove()
            }
            ))
        }(e),
        autowidth: ()=>function() {
            function e(e, t) {
                const o = e.value || e.getAttribute("placeholder") || "";
                t.innerHTML = o.replace(/ /g, "&nbsp;"),
                e.style.setProperty("width", Math.ceil(window.getComputedStyle(t).width.replace("px", "")) + 1 + "px", "important")
            }
            document.querySelectorAll(".autowidth-hidden").length && document.querySelectorAll(".autowidth-hidden").forEach((e=>e.remove()));
            for (const t of document.querySelectorAll(".autowidth")) {
                const o = document.createElement("div");
                o.classList.add("autowidth-hidden");
                const s = window.getComputedStyle(t);
                o.style.fontFamily = s.fontFamily,
                o.style.fontSize = s.fontSize,
                o.style.fontStyle = s.fontStyle,
                o.style.fontWeight = s.fontWeight,
                o.style.letterSpacing = s.letterSpacing,
                o.style.textTransform = s.textTransform,
                o.style.borderLeftWidth = s.borderLeftWidth,
                o.style.borderRightWidth = s.borderRightWidth,
                o.style.paddingLeft = s.paddingLeft,
                o.style.paddingRight = s.paddingRight,
                document.body.appendChild(o),
                e(t, o),
                t.classList.contains("inputmask") ? t.oninput = ()=>e(t, o) : t.addEventListener("input", (()=>e(t, o)))
            }
        }(),
        togglePassword: ()=>{
            document.addEventListener("click", (e=>{
                if (e.target.closest('[data-toggle="password"]')) {
                    const t = e.target.closest('[data-toggle="password"]').parentNode.querySelector("input");
                    t.type = "password" === t.type ? "text" : "password"
                }
            }
            ))
        }
        ,
        bootstrapSelect: ()=>function() {
            function e(e, t) {
                t.style.display = "" == e.value ? "none" : "inline";
                const o = e.parentNode.querySelector(".filter-option");
                "" == e.value ? o.classList.remove("mr-4") : o.classList.add("mr-4")
            }
            $(document).on("show.bs.select", ".bootstrap-select", (function() {
                this.querySelector(".dropdown-toggle").classList.add("focus")
            }
            )).on("hide.bs.select", ".bootstrap-select", (function() {
                this.querySelector(".dropdown-toggle").classList.remove("focus")
            }
            ));
            for (const t of document.querySelectorAll("select.bs-select")) {
                let o = {
                    style: "btn"
                };
                "true" === t.dataset.bsSelectCreatable && (o.liveSearch = !0,
                o.noneResultsText = "Press Enter to add: <b>{0}</b>"),
                t.dataset.bsSelectSize && (o.style = "btn btn-" + t.dataset.bsSelectSize,
                t.classList.add("form-control-" + t.dataset.bsSelectSize)),
                "true" === t.dataset.bsSelectClearable && t.insertAdjacentHTML("afterend", '<span class="bs-select-clear"></span>'),
                $(t).selectpicker(o);
                const s = t.closest(".bootstrap-select");
                "true" === t.dataset.bsSelectCreatable && s.querySelector(".bs-searchbox .form-control").addEventListener("keyup", (function(e) {
                    if (s.querySelector(".no-results") && 13 === e.keyCode) {
                        t.insertAdjacentHTML("afterbegin", `<option value="${this.value}">${this.value}</option>`);
                        let e = $(t).val();
                        Array.isArray(e) ? e.push(this.value) : e = this.value,
                        $(t).val(e),
                        $(t).selectpicker("toggle"),
                        $(t).selectpicker("refresh"),
                        $(t).selectpicker("render"),
                        s.querySelector(".dropdown-toggle").focus(),
                        this.value = ""
                    }
                }
                ));
                const n = t.parentNode.nextElementSibling;
                n && n.classList.contains("bs-select-clear") && (e(t, n),
                t.addEventListener("change", (()=>e(t, n))),
                n.addEventListener("click", (()=>{
                    $(t).selectpicker("val", ""),
                    t.dispatchEvent(new Event("change"))
                }
                )))
            }
        }(),
        select2: ()=>function() {
            for (const e of document.querySelectorAll(".select2")) {
                let t = {
                    width: "100%",
                    minimumResultsForSearch: "Infinity"
                };
                e.dataset.select2Search && "true" === e.dataset.select2Search && delete t.minimumResultsForSearch,
                e.dataset.select2Content && "true" === e.dataset.select2Content && (t.templateResult = e=>e.id ? $(e.element.dataset.content) : e.text,
                t.templateSelection = e=>e.id ? $(e.element.dataset.content) : e.text),
                $(e).select2(t).on("select2:unselecting", (function() {
                    $(this).data("unselecting", !0)
                }
                )).on("select2:opening", (function(e) {
                    $(this).data("unselecting") && ($(this).removeData("unselecting"),
                    e.preventDefault())
                }
                ))
            }
        }(),
        inputClearable: ()=>{
            document.addEventListener("click", (e=>{
                e.target.closest('[data-toggle="clear"]') && (e.target.closest('[data-toggle="clear"]').previousElementSibling.value = "")
            }
            ))
        }
    }
}
)();
$((()=>{
    $('[data-toggle="popover"]').popover(),
    $('[data-toggle="tooltip"]').tooltip()
}
)),
App.treeview(),
App.toggleSidebar(),
//App.sidebarBodyCustomScrollBar(),
App.autofocusModal(),
App.customFileInput(),
App.cardToolbar(),
App.navSection(),
App.accordionActive(),
App.dropdownHover(),
App.checkAll(),
App.backgroundCover(),
App.innerToggleSidebar(),
App.scrollNavbar(),
//App.featherIcon(),
App.todo(),
App.fixFlatpickr(),
App.summernoteFocus(),
App.togglePassword(),
App.inputClearable();
const observer = new MutationObserver((()=>{
    App.backgroundCover(),
    App.navSection(),
    App.accordionActive(),
    $('[data-toggle="popover"]').popover(),
    $('[data-toggle="tooltip"]').tooltip()
}
));
document.querySelector(".main") && (observer.observe(document.querySelector(".main"), {
    childList: !0,
    subtree: !0
}),
observer.observe(document.querySelector(".sidebar"), {
    childList: !0,
    subtree: !0
}));
const blue = App.color("blue")
  , indigo = App.color("indigo")
  , purple = App.color("purple")
  , pink = App.color("pink")
  , red = App.color("red")
  , orange = App.color("orange")
  , yellow = App.color("yellow")
  , green = App.color("green")
  , teal = App.color("teal")
  , cyan = App.color("cyan")
  , gray = App.color("gray")
  , lime = "#cddc39"
  , brown  = "#964B00";
