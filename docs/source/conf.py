# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# http://www.sphinx-doc.org/en/master/config

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))
import datetime
import sys
import os

# Get the project root dir
sys.path.insert(0, os.path.abspath("../../swift_browser_ui"))

# -- Project information -----------------------------------------------------
current_year = str(datetime.date.today().year)

project = "swift-browser-ui"
copyright = f"{current_year}, CSC Developers"
author = "CSC Developers"

# The full version, including alpha/beta/rc tags
version = release = "2025.4.1"


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.coverage",
    "sphinx.ext.ifconfig",
    "sphinx.ext.viewcode",
    "sphinx.ext.githubpages",
    "sphinx.ext.todo",
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

linkcheck_ignore = [r"https://editor.swagger.io/"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []

master_doc = "index"

autosummary_generate = True

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "collapse_navigation": True,
    "sticky_navigation": True,
    "version_selector": True,
    "prev_next_buttons_location": "bottom",
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]


def setup(app):
    """Add custom stylesheet."""
    app.add_css_file("style.css")


htmlhelp_basename = "swift-browser-ui"
man_pages = [(master_doc, "swift-browser-ui", [author], 1)]
texinfo_documents = [(master_doc, "swift-browser-ui", author, "Miscellaneous")]
