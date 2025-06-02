#include "backend.h"
#include <QDebug>

Backend::Backend(QObject *parent) : QObject(parent)
{
}

void Backend::saveImage(const QString &dataUrl)
{
    // dataUrl format: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    QString prefix = "data:image/png;base64,";
    if (!dataUrl.startsWith(prefix)) {
        emit imageSaved(false);
        return;
    }

    QByteArray base64Data = dataUrl.mid(prefix.length()).toUtf8();
    QByteArray imageData = QByteArray::fromBase64(base64Data);

    QString savePath = QDir::homePath() + "/miniPaint_saved.png";

    QFile file(savePath);
    if (file.open(QIODevice::WriteOnly)) {
        file.write(imageData);
        file.close();
        qDebug() << "Image saved to" << savePath;
        emit imageSaved(true);
    } else {
        qDebug() << "Failed to save image";
        emit imageSaved(false);
    }
}
