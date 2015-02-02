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

"""Contains all the checks available to the validator."""

import lxml.etree
import zipfile, tempfile, StringIO

# TODO:
# Missing tests
# - verify that thumbnail has correct dimensions
# - verify that thumbnail is valid PNG

def check_template(document, standard):
    """A template for writing new checks.
    A check function is passed an OpenRasterDocument and an OpenRasterStandard
    instance. It returns a 2-tuple; a bool indicating if the check passed or not,
    and a string describing the failure.
    The failure string should be empty if the check passed."""

    passed = True or False
    error_message = "A short description of how this test failed"

    return (passed, error_message)

def check_zipfile_integrity(doc, standard):
    passed = True
    error = ""

    bad_file = doc._zipfile.testzip()
    if bad_file:
        passed = False
        error = "Corrupt file: " % (str(bad_file),)

    return (passed, error)


def check_no_files_outside_data(doc, standard):
    passed = True
    error = ""

    non_standard_files = set(doc.get_filelist()) - set(standard.mandatory_files)
    outside_data_files = [f for f in non_standard_files if not f.startswith('data/')]

    if outside_data_files:
        passed = False
        error = "Files outside data/: " % (str(outside_data_files),)

    return (passed, error)

def check_mandatory_files(doc, standard):
    passed = True
    error = ""

    existing_files = set(doc.get_filelist())
    missing_files = set(standard.mandatory_files) - existing_files

    if missing_files:
        error = "Mandatory files missing: %s" % (str(missing_files),)
        passed = False

    return (passed, error)

def check_stack_follows_schema(doc, standard):
    passed = True
    error = ""

    if not standard.stack_schema_rng:
        error = "WARNING: disabled due to missing schema"
        return (passed, error)

    #TODO: support compact style rng format, or provide conversion
    xmlfile = StringIO.StringIO(doc.get_stack())

    relaxng = lxml.etree.RelaxNG(lxml.etree.fromstring(standard.stack_schema_rng))
    layerstack = lxml.etree.parse(xmlfile)

    passed = relaxng.validate(layerstack)
    if not passed:
        error = str(relaxng.error_log)

    return (passed, error)

def check_all_data_files_referenced(doc, standard):
    passed = True
    error = ""

    # Note: not strictly a violation of the spec
    # But typically a sign that something is wrong?

    files = set(standard.mandatory_files) - set(doc.get_filelist())
    unreferenced_data_files = set([f for f in files if f.startswith('data/')])

    xmlfile = StringIO.StringIO(doc.get_stack())
    layerstack = lxml.etree.parse(xmlfile)

    for elem in layerstack.iter():
        values = set(elem.values())
        unreferenced_data_files -= values

    if unreferenced_data_files:
        passed = False
        error = 'Unreferenced data files found: %s' % (unreferenced_data_files,)

    return (passed, error)


def check_mimetype_value(doc, standard):
    passed = True
    error = ""

    if not doc.mimetype == standard.mimetype:
        passed = False
        error = "Expected \"%s\", got \"%s\"" % (standard.mimetype, doc.mimetype)

    return (passed, error)

def check_mimetype_compression(doc, standard):
    passed = True
    error = ""

    compress_type = doc._zipfile.getinfo('mimetype').compress_type
    if compress_type != zipfile.ZIP_STORED:
        passed = False
        error = ""

    return (passed, error)

def check_thumbnail_exists(doc, standard):
    passed = True
    error = ""

    if not doc.read_file('Thumbnails/thumbnail.png'):
        passed, error = False, "file does not exist"

    return (passed, error)

def check_filename_encoding(doc, standard):
    passed = True
    error = ""

    def is_not_utf8(string):
        try:
            string.decode('UTF-8', 'strict')
        except UnicodeDecodeError:
            return True

        try:
            import chardet
            det = chardet.detect(string)
            encoding, confidence = det['encoding'], det['confidence']
            # ascii is UTF-8 compatible, so that is fine
            if encoding not in ('UTF-8', 'ascii') and confidence >= 0.95:
                return True
        except ImportError:
            pass

        return False

    wrong_filenames = []

    for filename in doc.get_filelist():
        if is_not_utf8(filename):
            wrong_filenames.append(filename)

    if wrong_filenames:
        passed = False
        error = "Not encoded using UTF-8:\n%s" % (wrong_filenames,)

    return (passed, error)

"""All checks available."""
all_checks = [
    check_zipfile_integrity,
    check_filename_encoding,
    check_mandatory_files,
    check_no_files_outside_data,
    check_thumbnail_exists,
    check_mimetype_compression,
    check_mimetype_value,
    check_stack_follows_schema,
    check_all_data_files_referenced,
]

test_descriptions = {
    check_zipfile_integrity: "Checking integrity of the zip archive",
    check_mandatory_files: "Checking that all mandatory files are present",
    check_no_files_outside_data: "Checking that there is no non-standard files outside data/",
    check_thumbnail_exists: "Checking that thumbnail exist",
    check_mimetype_compression: "Checking that mimetype is STORED",
    check_mimetype_value: "Checking mimetype value",
    check_stack_follows_schema: "Checking that stack.xml follows schema",
    check_all_data_files_referenced: "Checking that all files in data/ are referenced from stack.xml",
    check_filename_encoding: "Checking that filename encoding is UTF-8",
}

