#include <QApplication>
#include <QWebEngineView>
#include <QWebChannel>
#include "backend.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QWebEngineView view;

    // Setup backend and web channel
    Backend backend;
    QWebChannel channel;
    channel.registerObject(QStringLiteral("backend"), &backend);
    view.page()->setWebChannel(&channel);

    // Load the local HTML from resources
    view.setUrl(QUrl("qrc:/index.html"));

    view.resize(900, 600);
    view.show();

    return app.exec();
}
