import pymupdf

def read_cv(src):

    with pymupdf.open(stream=src.read(), filetype="pdf") as doc:
        return "".join(page.get_text() for page in doc)
