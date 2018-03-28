import $ from 'jquery'
import 'bootstrap'
import style from './css/style.scss'

let found = false

$(() => {
    const goto_video = () => {
        const marker = document.body.querySelector("a-marker")
        if (marker.object3D.visible) {
            if (found) return
            found = true
            $("#media-popup").find("iframe").attr("src", $('a-marker').data('video'))
            $("body").addClass("show-popup")
        }
        requestAnimationFrame(goto_video)
    }

    requestAnimationFrame(goto_video)    

    $(".popup").on("click", e => {
        e.preventDefault()
        e.stopPropagation()
        $("body").removeClass("show-popup")
    })
    $(".popup > iframe").on("click", e => { e.stopPropagation() })
})