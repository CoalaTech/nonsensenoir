#!/usr/bin/env python

# This file is a part of Oratools
# Copyright 2010 Jon Nordby <jononor@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import xml.dom.minidom, os

def prettify_files(pathnames, indent='   '):
    """Return a pretty multi-line string of the files represented by
    pathnames. File are shown sorted and grouped under their subdirectories."""
    string_list = []
    directories = []
    for path in sorted(pathnames):
        level = os.path.normpath(path).count(os.sep)
        pieces = path.split(os.sep)
        filename = pieces[-1]
        if len(pieces) >= 2:
            parent_dir = pieces[-2]
        if not parent_dir in directories:
            directories.append(parent_dir)
            string_list.append(parent_dir + '/')
        string_list.append(indent*level + pieces[-1])

    return '\n'.join(string_list)

class OpenRasterInspector(object):
    def __init__(self, document, print_headers=False):
        self.doc = document
        self.print_headers = print_headers

    def print_stack(self):
        stack = xml.dom.minidom.parseString(self.doc.get_stack())
        stack_pretty = stack.toprettyxml('   ', '')
        if self.print_headers:
            print 'STACK:'
        print stack_pretty
        print ''

    def print_files(self):
        if self.print_headers:
            print 'FILES:'
        print prettify_files(self.doc.get_filelist())
        print ''

    def print_mimetype(self):
        if self.print_headers: 
            print 'MIME-type:'
        print self.doc.mimetype
        print ''

    def print_all(self):
        self.print_mimetype()
        self.print_files()
        self.print_stack()

