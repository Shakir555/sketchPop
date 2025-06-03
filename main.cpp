#include <QApplication>
#include <QWebEngineView>
#include "backend.h"
#include <QWebChannel>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QWebEngineView view;

    // Setup backend and WebChannel
    Backend backend;
    QWebChannel *channel = new QWebChannel(&view);
    channel->registerObject(QStringLiteral("backend"), &backend);
    view.page()->setWebChannel(channel);

    // Load HTML from resources
    view.setUrl(QUrl("qrc:/web/index.html"));
    view.resize(800, 600);
    view.show();

    return app.exec();
}
