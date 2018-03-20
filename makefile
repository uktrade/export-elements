build: test_requirements test

clean:
	-find . -type f -name "*.pyc" -delete
	-find . -type d -name "__pycache__" -delete

test_requirements:
	pip install -r requirements_test.txt

flake8:
	flake8 . --exclude=.venv,node_modules

test: flake8; ./node_modules/.bin/gulp test

compile_test_requirements:
	python3 -m piptools compile requirements_test.in

heroku_deploy_dev:
	docker build -t registry.heroku.com/export-elements-dev/web .
	docker push registry.heroku.com/export-elements-dev/web

publish:
	rm -rf build dist; \
	python setup.py bdist_wheel; \
	twine upload --username $$DIRECTORY_PYPI_USERNAME --password $$DIRECTORY_PYPI_PASSWORD dist/*

.PHONY: build clean test_requirements flake8 pytest test publish
