#!/usr/bin/python

import os
import shutil
from oratools.document import OpenRasterDocument
from PIL import Image
from xml.dom import minidom
from tempfile import mkdtemp
import optparse

'''

    Converte um grupo de layers em um arquivo OpenRaster para um SpriteSheet
    Autor: Claudio Vinicius de Carvalho

'''

TEMP_PATH = mkdtemp(dir='.')


class StackLayer():

    def __init__(self, name, src, x, y):
        self.name = name
        self.src = src
        self.x = int(x)
        self.y = int(y)

        imgPath = os.path.join(TEMP_PATH, self.src)
        self.image = Image.open(imgPath)


class OpenRasterStack():
    """docstring for OpenRasterStack"""
    def __init__(self, infile):
        self.infile = infile
        self.xmldoc = minidom.parse(infile)

        self.parseDimensions()

        self.parseStack()

    def parseDimensions(self):
        imageData = self.xmldoc.getElementsByTagName('image')[0]
        h = imageData.attributes['h'].value
        w = imageData.attributes['w'].value
        self.dimensions = (int(w), int(h))

    def parseStack(self):
        stack = self.xmldoc.getElementsByTagName('stack')[0]
        layers = stack.getElementsByTagName('layer')
        self.layers = []
        for layer in layers:
            name = layer.getAttribute('name')
            src = layer.getAttribute('src')
            x = layer.getAttribute('x')
            y = layer.getAttribute('y')
            l = StackLayer(name, src, x, y)
            if(layer.hasAttribute('background_tile')):
                self.background = l
            else:
                self.layers.append(l)
        self.layers.reverse()


def createSpriteSheet(stack, outputFolder, fileName, resizeX, resizeY):
    numLayers = len(stack.layers)
    size = (stack.dimensions[0] * numLayers, stack.dimensions[1])
    canvas = Image.new('RGBA', size, 0xFFFFFF)
    offset = 0
    for layer in stack.layers:
        canvas.paste(layer.image, (layer.x + offset, layer.y))
        offset += stack.dimensions[0]
    if(resizeX):
        hRatio = size[0] / resizeX
        finalHeight = size[1] / hRatio
        canvas = canvas.resize((resizeX, finalHeight), 1)
    if(resizeY):
        wRatio = size[1] / resizeY
        finalWidth = size[0] / wRatio
        canvas = canvas.resize((finalWidth, resizeY), 1)
        print 'Resizing height'
    canvas.save(os.path.join(outputFolder, fileName + '.png'), 'png')


def main():
    parser = optparse.OptionParser()
    parser.add_option('-f', '--files', dest='inputfile',
                      action='store',
                      help=".ora files to convert")
    parser.add_option('-n', '--name', dest='outputName',
                      action='store',
                      help="Output name")
    parser.add_option('-o', '--output', dest='outputFolder',
                      help="Output folder. Defaults to the input's folder")
    parser.add_option('-x', '--resizex', dest='resizeX',
                      help="Final width of the image")
    parser.add_option('-y', '--resizey', dest='resizeY',
                      help="Final height of the image")

    options, args = parser.parse_args()

    if not options.inputfile:
        print 'Nenhum arquivo informado'
        return

    if not options.outputFolder:
        options.outputFolder = os.path.dirname(options.inputfile)

    ora = OpenRasterDocument(options.inputfile)
    ora.extract_to(TEMP_PATH)
    stack = OpenRasterStack(os.path.join(TEMP_PATH, 'stack.xml'))

    if options.outputName:
        name = options.outputName
    else:
        name = os.path.split(options.inputfile)[1].split('.')[0]

    if options.resizeX:
        options.resizeX = int(options.resizeX)
    if options.resizeY:
        options.resizeY = int(options.resizeY)

    createSpriteSheet(stack, options.outputFolder, name, resizeX=options.resizeX, resizeY=options.resizeY)

    shutil.rmtree(TEMP_PATH)

# Usage: python ora2spritesheet -f filename
if __name__ == '__main__':
    main()
