#ifndef BACKEND_H
#define BACKEND_H

#include <QObject>
#include <QImage>
#include <QFile>
#include <QByteArray>
#include <QBuffer>
#include <QDir>

class Backend : public QObject
{
    Q_OBJECT
public:
    explicit Backend(QObject *parent = nullptr);

public slots:
    void saveImage(const QString &dataUrl);

signals:
    void imageSaved(bool success);
};

#endif // BACKEND_H
