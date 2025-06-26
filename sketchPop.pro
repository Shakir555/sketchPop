QT += core gui widgets webenginewidgets webchannel

CONFIG += c++11

SOURCES += main.cpp \
           backend.cpp

HEADERS += backend.h

RESOURCES += resources.qrc

# Output directories for build artifacts
OBJECTS_DIR = o
MOC_DIR = moc
UI_DIR = moc
RCC_DIR = moc

TARGET = sketchPop
