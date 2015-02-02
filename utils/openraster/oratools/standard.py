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

class OpenRasterStandard(object):
    """Represents the standard, with each member describing an aspect or
    constraint given by it."""
    mandatory_files = [
        'mimetype',
        'stack.xml',
        'Thumbnails/thumbnail.png',
        ]
    mandatory_directories = ['Thumbnails', 'data']

    mimetype = 'image/openraster'
    thumbnail_max_dimensions = (256, 256)

    stack_schema_rng = None

    # Note: in the future, it might be useful to be able to
    # represent different versions of the standard
