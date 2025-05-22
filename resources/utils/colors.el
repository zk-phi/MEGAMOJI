(require 'color)

(defun iota (from to)
  (and (< from to) (cons from (iota (1+ from) to))))

(let ((hue-shift 0.1)
      ;; OLD (i/7)
      ;; (hue-and-lums
      ;;  '((0.0000 . (0.3 0.5 0.7))
      ;;    (0.1429 . (0.3 0.5 0.7))
      ;;    (0.2857 . (0.3 0.5 0.7))
      ;;    (0.4286 . (0.3 0.5 0.7))
      ;;    (0.5714 . (0.3 0.5 0.7))
      ;;    (0.7143 . (0.3 0.5 0.7))
      ;;    (0.8571 . (0.3 0.5 0.7))))
      ;; NEW (hand-picked)
      ;; 0.12 is came from the UI theme color #eeaa00
      (hue-and-lums
       '((0.99 . (0.30 0.50 0.70))
         (0.12 . (0.30 0.50 0.70))
         (0.33 . (0.20 0.40 0.50))
         (0.56 . (0.25 0.45 0.65))
         (0.66 . (0.30 0.50 0.70))
         (0.75 . (0.30 0.50 0.70))
         (0.87 . (0.30 0.50 0.70)))))
  (mapcar
   (lambda (hue-and-lum)
     (let ((h (car hue-and-lum))
           (lums (cdr hue-and-lum)))
       (mapcar
        (lambda (l) (apply 'color-rgb-to-hex (nconc (color-hsl-to-rgb h 1 l) '(2))))
        lums)))
   hue-and-lums))

;; NEW
(("#990009" "#ff000f" "#ff656f")
 ("#996e00" "#ffb700" "#ffd465")
 ("#026600" "#04cc00" "#05ff00")
 ("#00517f" "#0092e5" "#4cbefe")
 ("#000699" "#000aff" "#656cff")
 ("#4c0099" "#7f00ff" "#b265ff")
 ("#990077" "#ff00c6" "#ff65dd"))

;; OLD
(("#990000" "#ff0000" "#ff6565")
 ("#998300" "#ffda00" "#ffe965")
 ("#2b9900" "#48ff00" "#91ff65")
 ("#009957" "#00ff91" "#65ffbd")
 ("#005799" "#0091ff" "#65bdff")
 ("#2b0099" "#4800ff" "#9165ff")
 ("#990083" "#ff00da" "#ff65e9"))
