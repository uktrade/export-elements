"""
Export Directory API client
"""
import ast
import re
from setuptools import setup


def get_version():
    pattern = re.compile(r'__version__\s+=\s+(.*)')

    with open('export_elements/version.py', 'rb') as src:
        return str(ast.literal_eval(
            pattern.search(src.read().decode('utf-8')).group(1)
        ))


setup(
    name='export_elements',
    version=get_version(),
    url='https://github.com/uktrade/export-elements',
    license='MIT',
    author='Department for International Trade',
    description='Wrapper around govuk elements.',
    packages=['export_elements'],
    package_data={'export_elements': ['*']},
    long_description=open('README.md').read(),
    include_package_data=True,
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ]
)
