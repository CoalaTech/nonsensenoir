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

from oratools.standard import OpenRasterStandard
from oratools import validationchecks

import traceback

class OpenRasterValidator(object):
    """Validate an OpenRasterDocument against a OpenRasterStandard."""

    def __init__(self, document, standard=None):
        self._document = document
        self._standard = standard or OpenRasterStandard()
        self._tests = validationchecks.all_checks

    def run_tests(self, tests=None):
        """Run tests.
        Returns an iterator. Each iteration will yield
        (description, passed, errormsg)"""

        if tests:
            self._tests = tests

        for test in self._tests:
            description = validationchecks.test_descriptions[test]

            try:
                passed, errormsg = test(self._document, self._standard)
            except Exception, e:
                passed = False
                errormsg = "EXCEPTION: " + repr(e)
                traceback.print_exc()

            yield (description, passed, errormsg)

