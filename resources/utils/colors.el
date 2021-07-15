(require 'color)

(defun iota (from to)
  (and (< from to) (cons from (iota (1+ from) to))))

(let ((hues 7)
      (lums '(0.3 0.5 0.7)))
  (mapcar (lambda (l)
            (mapcar (lambda (h)
                      (apply 'color-rgb-to-hex
                             (nconc (color-hsl-to-rgb (* h (/ 1.0 hues)) 1 l) '(2))))
                    (iota 0 hues)))
          lums))
