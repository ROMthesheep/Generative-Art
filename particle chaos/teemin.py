import random
import argparse
import sys
import colorsys
import logging
from enum import Enum
import xml.etree.ElementTree as xtree

__author__ = 'Romthesheep'
__version__ = '0.1'

#Proyecto clon para entender y comprender la transcripcion a vsg


# clases utilitarias

class Direccion(Enum):
    NORTH = 1
    SOUTH = 2
    EAST = 3
    WEST = 4


class Sentido(Enum):
    UP = 0
    DOWN = 1


class LD():  # linea diagonal

    def __init__(self, sentido, hue, x1, y1, x2, y2):
        self.sentido = sentido
        self.hue = hue
        self.x1 = x1 #if (sentido == Sentido.DOWN) else x2
        # self.x2 = x2 if (sentido == Sentido.DOWN) else x1
        self.y1 = y1
        # self.y2 = y2

    def __repr__(self):
        return '\\' if self.sentido == Sentido.DOWN else '/'


def hueBlend(a, b):
    # mezcla dos valores de tono de forma linear : (y-y0)/(x-x0)=(y1-y0)/(x1-x0) // y=y0+(x-x0)*(y1-y0)/(x1-x0)
    # En este caso un color a (y1) y un color b(y2) -> a+(b-a)/2
    # el hue se mide en grados
    if a > b:
        a, b = b, a
    d = b - a
    if d > 180:
        a += 360
        return (a + ((b - a) / 2.0)) % 360
    return a + (d / 2)


def hueCheck(sentido, x, y, filas, hueSwift):
    hues = []
    if y:
        if sentido == Sentido.DOWN:
            if x and (filas[y - 1][x - 1].sentido == Sentido.DOWN):
                hues.append(filas[y - 1][x - 1].hue)
            if filas[y - 1][x].sentido == Sentido.UP:
                hues.append(filas[y - 1][x].hue)
        else:  # slope == Slope.UP
            if filas[y-1][x].sentido == Sentido.DOWN:
                hues.append(filas[y - 1][x].hue)
            if (x < len(filas[y - 1]) - 1) and (filas[y - 1][x + 1].sentido == Sentido.UP):
                hues.append(filas[y - 1][x + 1].hue)
    if hues:
        if len(hues) == 2:
            return hueBlend(hues[0], hues[1])
        return (hues[0] + hueSwift) % 360
    return None


def hslAhex(hue, saturacion, lightness):
    return '#{:02x}{:02x}{:02x}'.format(
        *(int(c * 255) for c in list(colorsys.hls_to_rgb(hue / 360, lightness, saturacion))))


# Programa en si
def main():
    ap = argparse.ArgumentParser(
        description=('Version modificada del codigo generativo de Christian Rosentreter, temo.'),
        epilog='Para ver la version original de este sistema id a https://github.com/the-real-tokai/macuahuitl',
        add_help=False,
    )

    g = ap.add_argument_group('Init')
    g.add_argument('-V', '--version', action='version', help='Muestra la version',
                   version='%(prog)s {}'.format(__version__), )
    g.add_argument('-h', '--help', action='help', help='enserio?')

    g.add_argument_group('Programa')
    g.add_argument('--columnas', metavar='INT', type=int, help='Cantidad de columnas', default=40)
    g.add_argument('--filas', metavar='INT', type=int, help='Cantidad de filas', default=30)
    g.add_argument('--escala', metavar='FLOAT', type=float, help='Escala del grafico', default=10.0)
    g.add_argument('--semilla', metavar='INT', type=int, help='Numero generador del grafico')

    g = ap.add_argument_group('Miscellaneous')
    g.add_argument('--marco', metavar='FLOAT', type=float, help='Ajusta los margenes  [:20.0]',
                   default=20.0)
    g.add_argument('--ancho-linea', metavar='FLOAT', type=float, help='Ancho de las lineas  [:2.0]',
                   default=1.0)
    g.add_argument('--fondo', metavar='COLOR', type=str,
                   help='Color del fondo')
    g.add_argument('--rotacion-hue', metavar='FLOAT', type=float,
                   help='angulo maximo de rotacion del color  [:15.0]',
                   default=15.0)
    g.add_argument('--linea-rotacion-hue', metavar='FLOAT', type=float,
                   help='separate hue shift for continuous lines; if not passed `--hue-shift\' applies too')

    userInput = ap.parse_args()

    chaos = random.Random(userInput.semilla)
    escala = userInput.escala
    marco = userInput.marco
    filas = []
    masterHue = chaos.uniform(0,360)
    huesl = userInput.rotacion_hue if userInput.linea_rotacion_hue is None else userInput.linea_rotacion_hue

    for y in range(0, userInput.filas):
        # master_hue = (360 / user_input.rows * y) % 360
        filas.append([])
        for x in range(0, userInput.columnas):
            sentido = chaos.choice([Sentido.UP, Sentido.DOWN])
            hue = hueCheck(sentido, x, y, filas, huesl)
            if hue is None:
                hue = masterHue
                masterHue = (masterHue + userInput.rotacion_hue) % 360
            filas[y].append(LD(sentido, hue, (x*escala+marco), (y*escala+marco), (x*escala+escala+marco), (y*escala+escala+marco)))
            # print(filas)
    pathfinder = None
    circlePos = None
    # print("filas: " + str(userInput.filas))
    # print("columnas: " + str(userInput.columnas))

    # XML/SVG generator:

    vbw = int((escala*userInput.columnas)+(marco*2))
    vbh = int((escala * userInput.filas)+(marco*2))

    svg = xtree.Element('svg', {'width':'100%', 'height':'100%', 'xmlns':'http://www.w3.org/2000/svg', 'viewBox':'0 0 {} {}'.format(vbw, vbh)})
    title = xtree.SubElement(svg, 'title')
    title.text = 'A teemin Artwork'

    if userInput.fondo:
        xtree.SubElement(svg,'rect',{'id':'background', 'x':'0', 'y':'0', 'width':str(vbw), 'height':str(vbh), 'fill':userInput.fondo})
    svgGrupo = xtree.SubElement(svg,'g',{'id':'laberint0', 'stroke-width':str(userInput.ancho_linea), 'stroke-linecap':'round'})

    for idFila, fila in enumerate(filas):
        for idCol, e in enumerate(fila):
            xtree.SubElement(svgGrupo, 'ellipse', {
                'id':   'elemento-{}x{}'.format(idCol+1,idFila+1),
                'cx':     str(e.x1),
                'cy':     str(e.y1),
                'rx':     str(chaos.uniform(0,10)),#str(e.x2)
                'ry':     str(chaos.uniform(0,10)),#str(e.y2)
                'stroke': hslAhex(e.hue, .6, .5),
                'fill':   hslAhex(e.hue, .6, .5),#hslAhex(chaos.uniform(0,360),.6,.5)
            })

    rawxml = xtree.tostring(svg, encoding='unicode')

    print(rawxml)

if __name__ == '__main__':
	main()