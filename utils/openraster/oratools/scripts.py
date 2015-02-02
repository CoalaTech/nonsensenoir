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

import optparse, os, os.path

import oratools
from oratools.document import OpenRasterDocument
from oratools.validator import OpenRasterValidator
from oratools.inspector import OpenRasterInspector
from oratools.standard import OpenRasterStandard

# TODO:
# Missing scripts
# - ora-diff: Show the difference between two OpenRaster files.

def ora_verify():
    """Verify an OpenRaster file. Main function, meant to be called
    from a wrapper script."""
    parser = optparse.OptionParser(usage="usage: %prog [options] FILE")
    parser.add_option("-s", "--stack", dest="layerstack_schema", metavar="SCHEMA.rng")
    parser.add_option("-q", "--quiet", action="store_true")
    parser.add_option("-f", "--first-failure", action="store_true", dest="stop_on_first_fail")
    parser.add_option("-o", "--only-failures", action="store_true", dest="print_only_failures")
    options, args = parser.parse_args()

    standard = None # Use default

    if options.layerstack_schema:
        schema_str = open(options.layerstack_schema).read()
        standard = OpenRasterStandard()
        standard.stack_schema_rng = schema_str

    document = OpenRasterDocument(args[0])
    validator = OpenRasterValidator(document, standard)

    def print_test_results(description, passed, error):
        if options.quiet or (passed and options.print_only_failures):
            return

        pass_string = "Pass" if passed else "Fail"
        error_string = "\n"+error if error else error
        error_string = error_string.replace('\n', '\n\t')
        print "%s: %s%s" % (description, pass_string, error_string)

    checks_passed = True
    for description, passed, error in validator.run_tests():
        print_test_results(description, passed, error)

        if not passed:
            checks_passed = False
            if options.stop_on_first_fail:
                break;

    retval = 0 if checks_passed else -1
    return retval

def ora_inspect():
    """Show the contents of an OpenRaster file. Main function, meant to be called
    from a wrapper script."""
    parser = optparse.OptionParser(usage="usage: %prog [options] FILE")
    parser.add_option("-m", "--mime", action="store_true", dest="inspect_mimetype")
    parser.add_option("-f", "--files", action="store_true", dest="inspect_files")
    parser.add_option("-s", "--stack", action="store_true", dest="inspect_stack")
    parser.add_option("-p", "--print-headers", action="store_true", dest="print_headers")
    options, args = parser.parse_args()

    document = OpenRasterDocument(args[0])
    ora_inspect = OpenRasterInspector(document, options.print_headers)

    if not (options.inspect_mimetype or
            options.inspect_files or
            options.inspect_stack):
        ora_inspect.print_all()
        return

    if options.inspect_mimetype:
        ora_inspect.print_mimetype()
    if options.inspect_files:
        ora_inspect.print_files()
    if options.inspect_stack:
        ora_inspect.print_stack()


def ora_unpack():
    """Unpack an OpenRaster archive."""
    parser = optparse.OptionParser(usage="usage: %prog [options] FILE [DIR]")
    options, args = parser.parse_args()

    if len(args) == 1:
        inpath = args[0]
        outpath = os.path.splitext(os.path.basename(inpath))[0]
        if os.path.exists(outpath):
            print """Error: Implicit output directory %s already exists. 
                    Specify the output explicitly.""" % outpath
            return
    elif len(args) == 2:
        inpath, outpath = args
    else:
        parser.print_help()
        return

    ora = OpenRasterDocument(inpath)
    ora.extract_to(outpath)

def ora_pack():
    """Create an OpenRaster archive from files on-disk."""
    parser = optparse.OptionParser(usage="usage: %prog [options] DIR [FILE]")
    options, args = parser.parse_args()

    if len(args) == 1:
        inpath = args[0]
        outpath = os.path.basename(inpath.rstrip(os.sep))  + ".ora"
        if os.path.exists(outpath):
            print """Error: Implicit output file %s already exists.
                    Specify the output explicitly.""" % outpath
            return
    elif len(args) == 2:
        inpath, outpath = args
        filename, ext = os.path.splitext(outpath)
        if not ext == ".ora":
            print "Warning: Missing .ora extension, added automatically"
            outpath += ".ora"
    else:
        parser.print_help()
        return

    if not os.path.isdir(inpath):
        print "Error: Specified input %s is not a directory" % inpath
        return
    #TODO: option to take files as input instead of directory

    document = oratools.document.create_from_directory(inpath, outpath)
