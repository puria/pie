import 'bootstrap'
import $ from 'jquery'
import style from './css/style.scss'

let found = false

$(() => {
    const isMarkerFound = () => found
    const setMarkerFound = (s) => { found = s }
    const gotoVideo = () => {
        $("a-marker").each((index, marker) => {
            if (marker.object3D.visible) {
                if (isMarkerFound()) return
                setMarkerFound(true)
                $("#media-popup").find("iframe").attr("src", $(marker).data('video'))
                $("body").addClass("show-popup")
            }
        })
        requestAnimationFrame(gotoVideo)
    }

    requestAnimationFrame(gotoVideo)

    $(".popup").on("click", e => {
        e.preventDefault()
        e.stopPropagation()
        $("body").removeClass("show-popup")
        $("#media-popup").find("iframe").attr("src", '')
        setMarkerFound(false)
        requestAnimationFrame(gotoVideo)
    })
    $(".popup > iframe").on("click", e => { e.stopPropagation() })
})
