(require 'color)

(defun iota (from to)
  (and (< from to) (cons from (iota (1+ from) to))))

(let ((hue-shift 0.1)
      ;; (hues '(0.0 0.1429 0.2857 0.4286 0.5714 0.7143 0.8571)) ; OLD (i/7)
      (hues '(0.0 0.12 0.33 0.45 0.66 0.75 0.87))             ; NEW (hand-picked)
      (lums '(0.3 0.5 0.7)))
  (mapcar
   (lambda (l)
     (mapcar
      (lambda (h) (apply 'color-rgb-to-hex (nconc (color-hsl-to-rgb h 1 l) '(2))))
      hues))
   lums))

;; NEW
(("#990000" "#996e00" "#039900" "#00996b" "#000699" "#4c0099" "#990077")
 ("#ff0000" "#ffb700" "#05ff00" "#00ffb2" "#000aff" "#7f00ff" "#ff00c6")
 ("#ff6565" "#ffd465" "#69ff65" "#65ffd1" "#656cff" "#b265ff" "#ff65dd"))

;; OLD
(("#990000" "#998300" "#2b9900" "#009957" "#005799" "#2b0099" "#990083")
 ("#ff0000" "#ffda00" "#48ff00" "#00ff91" "#0091ff" "#4800ff" "#ff00da")
 ("#ff6565" "#ffe965" "#91ff65" "#65ffbd" "#65bdff" "#9165ff" "#ff65e9"))
