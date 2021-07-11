(require 'color)

(mapcar (lambda (l)
          (mapcar (lambda (h)
                    (apply 'color-rgb-to-hex (nconc (color-hsl-to-rgb (* h (/ 1 7.0)) 1 l) '(2))))
                  '(0 1 2 3 4 5 6)))
        '(0.3 0.5 0.7))
