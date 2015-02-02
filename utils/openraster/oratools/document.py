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

""""""

import zipfile, os.path

class OpenRasterDocument(object):
    """Represents a OpenRaster document. Most functionality available in
    this library centers around this class. It can for instance be validated
    using OpenRasterValidator or inspected (visualized) using OpenRasterInspector.
    """

    # Note: currently only a thin wrapper around a zipfile.ZipFile

    def __init__(self, filename):
        self._filename = filename
        self._zipfile = zipfile.ZipFile(filename)

    def get_mimetype(self):
        """Return the mimetype as a string."""
        return self._zipfile.read("mimetype")
    mimetype = property(get_mimetype)

    def get_stack(self):
        """Return the stack as a string."""
        return self._zipfile.read("stack.xml")
    stack = property(get_stack)

    def get_filelist(self):
        """Return the files in the document as a list of strings."""
        return self._zipfile.namelist()

    def extract_to(self, path):
        """Extract the files in the document to path."""
        return self._zipfile.extractall(path)

    def read_file(self, filename):
        """Read file filename from the document."""
        return self._zipfile.read(filename)

    def close(self):
        """Close the document."""
        return self._zipfile.close()

def create_from_directory(inpath, outpath):
    """Create an OpenRaster file by writing the files in directory inpath
    into a zip archive. Returns a OpenRasterDocument object."""
    # Note: currently we just naively write all the files into the archive
    # with no special handling.

    # TODO:
    # Validate the document, raise warnings if not conformant
    # If mimetype is missing, raise warning but create it

    # Build list of files
    files = []
    for dirpath, dirnames, filenames in os.walk(inpath):
        for name in filenames:
            files.append(os.path.join(dirpath, name))

    # Write files into archive
    archive = zipfile.ZipFile(outpath, 'w')

    for f in files:
        archive.write(f, f.lstrip(inpath))

    archive.close()

    return OpenRasterDocument(outpath)
