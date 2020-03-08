NAME := navigate-location
XPI := $(NAME).xpi
SOURCE := css icons js manifest.json popup.html

.PHONY: build clean

build:
	zip -r $(XPI) $(SOURCE)

clean:
	-@rm $(XPI)

