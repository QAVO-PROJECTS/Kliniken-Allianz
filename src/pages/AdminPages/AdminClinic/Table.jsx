import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Row,
    Col,
    Select,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
    useDeleteClinicMutation,
    useGetAllClinicQuery,
    useGetAllServiceQuery,
    usePostClinicMutation,
    usePutClinicMutation,
} from "../../../services/userApi.jsx";
import {
    CERT_CLINIC_URL,
    CLINIC_CARD_IMAGES,
    CLINIC_IMAGES,
    DOCTOR_IMG_URL,
    SERVICE_CARD_IMAGES
} from "../../../contants.js";

const ClinicTable = () => {
    const { data: getAllClinic, refetch: refetchClinics } = useGetAllClinicQuery();
    const { data: getAllService } = useGetAllServiceQuery();
    const clinics = getAllClinic?.data || [];
    const services = getAllService?.data || [];

    const [postClinic] = usePostClinicMutation();
    const [putClinic] = usePutClinicMutation();
    const [deleteClinic] = useDeleteClinicMutation();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingClinic, setEditingClinic] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);
    const [clinicImagesFileList, setClinicImagesFileList] = useState([]);
    const [certificateImagesFileList, setCertificateImagesFileList] = useState([]);
    // State to track deleted IDs
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);
    const [deletedClinicImages, setDeletedClinicImages] = useState([]);
    const [deletedCertificates, setDeletedCertificates] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setClinicImagesFileList([]);
        setCertificateImagesFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingClinic(record);
        // Map doctorIds from record.doctors

        // Map clinicServiceIds from record.services
        const clinicServiceIds = [...new Set(record.services.map((service) => service.id))];

        // Reset deleted IDs
        setDeletedServiceIds([]);
        setDeletedClinicImages([]);
        setDeletedCertificates([]);

        // Set form fields
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            location: record.location,
            clinicServiceIds: clinicServiceIds,
        });

        // Set certificate images
        setCertificateImagesFileList(
            record.clinicSertificates
                ? record.clinicSertificates.map((image, index) => ({
                    uid: `-${index + 1}`,
                    name: image,
                    status: "done",
                    url: CERT_CLINIC_URL + image,
                }))
                : []
        );

        // Set clinic card image
        setCardFileList(
            record.clinicCardImage
                ? [
                    {
                        uid: "-1",
                        name: record.clinicCardImage,
                        status: "done",
                        url: CLINIC_CARD_IMAGES + record.clinicCardImage,
                    },
                ]
                : []
        );

        // Set clinic images
        setClinicImagesFileList(
            record.clinicImages
                ? record.clinicImages.map((image, index) => ({
                    uid: `-${index + 1}`,
                    name: image,
                    status: "done",
                    url: CLINIC_IMAGES + image,
                }))
                : []
        );

        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingClinic(null);
        setDeletedServiceIds([]);
        setDeletedClinicImages([]);
        setDeletedCertificates([]);
    };

    // Form submission handlers
    const handleAddClinic = async (values) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("nameEng", values.nameEng);
            formData.append("nameRu", values.nameRu);
            formData.append("description", values.description);
            formData.append("descriptionEng", values.descriptionEng);
            formData.append("descriptionRu", values.descriptionRu);
            formData.append("location", values.location || "");



            if (values.clinicServiceIds && values.clinicServiceIds.length > 0) {
                values.clinicServiceIds.forEach((id) => {
                    formData.append(`clinicServiceIds`, id);
                });
            }

            if (certificateImagesFileList.length > 0) {
                certificateImagesFileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append(`clinicSertificates`, file.originFileObj);
                    }
                });
            }

            if (cardFileList.length > 0 && cardFileList[0].originFileObj) {
                formData.append("clinicCardImage", cardFileList[0].originFileObj);
            }

            if (clinicImagesFileList.length > 0) {
                clinicImagesFileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append(`clinicImages`, file.originFileObj);
                    }
                });
            }

            await postClinic(formData).unwrap();
            message.success("Clinic added successfully!");

            form.resetFields();
            setCardFileList([]);
            setClinicImagesFileList([]);
            setCertificateImagesFileList([]);
            setIsAddModalVisible(false);

            refetchClinics();
        } catch (error) {
            console.error("Error adding clinic:", error);
            message.error("Failed to add clinic. Please try again.");
        }
    };

    const handleEditClinic = async (values) => {
        try {
            const formData = new FormData();

            // Append the clinic ID
            formData.append("id", editingClinic.id);

            // Append text-based fields
            formData.append("name", values.name);
            formData.append("nameEng", values.nameEng);
            formData.append("nameRu", values.nameRu);
            formData.append("description", values.description);
            formData.append("descriptionEng", values.descriptionEng);
            formData.append("descriptionRu", values.descriptionRu);
            formData.append("location", values.location || "");

            // Handle doctorIds (send only added or removed)



            // Handle clinicServiceIds (send only added or removed)
            const originalServiceIds = new Set(editingClinic?.services.map((s) => s.id) || []);
            const newServiceIds = new Set(values.clinicServiceIds || []);
            // Added service IDs (in new but not in original)
            const addedServiceIds = [...newServiceIds].filter((id) => !originalServiceIds.has(id));
            // Removed service IDs (in original but not in new, already tracked in deletedServiceIds)
            if (addedServiceIds.length > 0) {
                addedServiceIds.forEach((id) => {
                    formData.append(`clinicServiceIds`, id);
                });
            }
            if (deletedServiceIds.length > 0) {
                deletedServiceIds.forEach((id) => {
                    formData.append(`deleteClinicServiceIds`, id);
                });
            }

            // Handle deleted clinic images
            if (deletedClinicImages.length > 0) {
                formData.append("deleteClinicImages", deletedClinicImages.join(","));
            }

            // Handle deleted certificates
            if (deletedCertificates.length > 0) {
                formData.append("deleteClinicSertificates", deletedCertificates.join(","));
            }

            // Handle clinicCardImage
            if (cardFileList.length > 0 && cardFileList[0].originFileObj) {
                formData.append("clinicCardImage", cardFileList[0].originFileObj);
            }

            // Handle clinicImages
            if (clinicImagesFileList.length > 0) {
                clinicImagesFileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append(`clinicImages`, file.originFileObj);
                    }
                });
            }

            // Handle clinicSertificates
            if (certificateImagesFileList.length > 0) {
                certificateImagesFileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append(`clinicSertificates`, file.originFileObj);
                    }
                });
            }

            await putClinic(formData).unwrap();
            message.success("Clinic updated successfully!");

            editForm.resetFields();
            setCardFileList([]);
            setClinicImagesFileList([]);
            setCertificateImagesFileList([]);
            setDeletedServiceIds([]);
            setDeletedClinicImages([]);
            setDeletedCertificates([]);
            setIsEditModalVisible(false);
            setEditingClinic(null);

            refetchClinics();
        } catch (error) {
            console.error("Error updating clinic:", error);
            message.error("Failed to update clinic. Please try again.");
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        try {
            await deleteClinic(id).unwrap();
            message.success("Clinic deleted successfully!");
            refetchClinics();
        } catch (error) {
            console.error("Error deleting clinic:", error);
            message.error("Failed to delete clinic. Please try again.");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "clinicCardImage",
            key: "clinicCardImage",
            render: (clinicCardImage) => {
                if (!clinicCardImage) return <span>No Image</span>;
                return (
                    <img
                        src={CLINIC_CARD_IMAGES + clinicCardImage}
                        alt="Şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                );
            },
        },
        {
            title: "Klinika adı",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Açıqlama",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Əməliyyatlar",
            key: "actions",
            render: (text, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        <FaRegEdit />
                    </Button>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="default" danger>
                            <MdDeleteForever />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // Expanded row rendering
    const expandedRowRender = (record) => {
        const doctorColumns = [
            {
                title: "Ad",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Soyad",
                dataIndex: "surName",
                key: "surName",
            },
            {
                title: "Açıqlama",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "Şəkil",
                dataIndex: "doctorImage",
                key: "doctorImage",
                render: (doctorImage) =>
                    doctorImage ? (
                        <img
                            src={DOCTOR_IMG_URL + doctorImage}
                            alt="Həkim Şəkli"
                            style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                        />
                    ) : (
                        <span>No Image</span>
                    ),
            },
            {
                title: "Reytinq",
                dataIndex: "rate",
                key: "rate",
            },
            {
                title: "Rol",
                dataIndex: "role",
                key: "role",
            },
            {
                title: "Doğum Tarixi",
                dataIndex: "bornDate",
                key: "bornDate",
            },
        ];

        const serviceColumns = [
            {
                title: "Xidmət Adı",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Açıqlama",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "Şəkil",
                dataIndex: "serviceCardImage",
                key: "serviceCardImage",
                render: (serviceCardImage) =>
                    serviceCardImage ? (
                        <img
                            src={SERVICE_CARD_IMAGES + serviceCardImage}
                            alt="Xidmət Şəkli"
                            style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                        />
                    ) : (
                        <span>No Image</span>
                    ),
            },
        ];

        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span={12}>
                        <p>
                            <strong>Ad (EN):</strong> {record.nameEng}
                        </p>
                        <p>
                            <strong>Ad (RU):</strong> {record.nameRu}
                        </p>
                        <p>
                            <strong>Açıqlama (EN):</strong> {record.descriptionEng}
                        </p>
                        <p>
                            <strong>Açıqlama (RU):</strong> {record.descriptionRu}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p>
                            <strong>Lokasiya:</strong> {record.location || "Məlumat yoxdur"}
                        </p>
                        <p>
                            <strong>Klinika Şəkilləri:</strong>{" "}
                            {record.clinicImages.length > 0 ? (
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {record.clinicImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={CLINIC_IMAGES + image}
                                            alt={`Klinika Şəkili ${index + 1}`}
                                            style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                "Şəkil yoxdur"
                            )}
                        </p>
                        <p>
                            <strong>Sertifikatlar:</strong>{" "}
                            {record.clinicSertificates.length > 0 ? (
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {record.clinicSertificates.map((image, index) => (
                                        <img
                                            key={index}
                                            src={CERT_CLINIC_URL + image}
                                            alt={`Sertifikat ${index + 1}`}
                                            style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                "Sertifikat yoxdur"
                            )}
                        </p>
                    </Col>
                </Row>
                <h4>Həkimlər</h4>
                <Table
                    columns={doctorColumns}
                    dataSource={record.doctors}
                    pagination={false}
                    rowKey="id"
                />
                <h4>Xidmətlər</h4>
                <Table
                    columns={serviceColumns}
                    dataSource={record.services}
                    pagination={false}
                    rowKey="id"
                />
            </div>
        );
    };

    return (
        <div className="p-4">
            <Button
                type="primary"
                onClick={showAddModal}
                className="mb-4 bg-blue-500 hover:bg-blue-600"
            >
                +
            </Button>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={clinics}
                pagination={{ pageSize: 6 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.location ||
                        record.doctors.length > 0 ||
                        record.services.length > 0,
                }}
            />

            {/* Add Clinic Modal */}
            <Modal
                title="Yeni Klinika Əlavə Et"
                visible={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleAddClinic}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Klinika Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Klinika Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Klinika Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="Lokasiya"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Lokasiya daxil edin" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="clinicServiceIds"
                                label="Xidmətlər"
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Xidmətləri seçin"
                                    options={services.map((service) => ({
                                        label: service.name,
                                        value: service.id,
                                    }))}
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item label="Sertifikat Şəkilləri">
                                <Upload
                                    name="clinicSertificates"
                                    listType="picture-card"
                                    fileList={certificateImagesFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setCertificateImagesFileList(fileList)}
                                    onRemove={(file) =>
                                        setCertificateImagesFileList(
                                            certificateImagesFileList.filter((f) => f.uid !== file.uid)
                                        )
                                    }
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Sertifikat şəkilləri əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item label="Klinika Kart Şəkli">
                                <Upload
                                    name="clinicCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Klinika Şəkilləri">
                                <Upload
                                    name="clinicImages"
                                    listType="picture-card"
                                    fileList={clinicImagesFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setClinicImagesFileList(fileList)}
                                    onRemove={(file) =>
                                        setClinicImagesFileList(
                                            clinicImagesFileList.filter((f) => f.uid !== file.uid)
                                        )
                                    }
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Şəkillər əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Clinic Modal */}
            <Modal
                title="Klinika Redaktə Et"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
                className="rounded-lg"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditClinic}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Klinika Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Klinika Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Klinika Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" className="rounded-md" />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="Lokasiya"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Lokasiya daxil edin" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="clinicServiceIds"
                                label="Xidmətlər"
                                rules={[{ required: false }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Xidmətləri seçin"
                                    options={services.map((service) => ({
                                        label: service.name,
                                        value: service.id,
                                    }))}
                                    onChange={(selectedIds) => {
                                        // Find removed service IDs
                                        const originalServiceIds = editingClinic?.services.map((s) => s.id) || [];
                                        const removedIds = originalServiceIds.filter(
                                            (id) => !selectedIds.includes(id)
                                        );
                                        setDeletedServiceIds([...new Set([...deletedServiceIds, ...removedIds])]);
                                    }}
                                    className="rounded-md"
                                />
                            </Form.Item>
                            <Form.Item label="Sertifikatlar">
                                <Upload
                                    name="clinicSertificates"
                                    listType="picture-card"
                                    fileList={certificateImagesFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setCertificateImagesFileList(fileList)}
                                    onRemove={(file) => {
                                        setCertificateImagesFileList(
                                            certificateImagesFileList.filter((f) => f.uid !== file.uid)
                                        );
                                        if (file.status === "done" && file.name) {
                                            setDeletedCertificates([...deletedCertificates, file.name]);
                                        }
                                    }}
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Sertifikatlar əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (EN)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea
                                    placeholder="Açıqlama daxil edin (RU)"
                                    className="rounded-md"
                                    rows={4}
                                />
                            </Form.Item>
                            <Form.Item label="Klinika Kart Şəkli">
                                <Upload
                                    name="clinicCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                    className="rounded-md"
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div className="mt-2">Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Klinika Şəkilləri">
                                <Upload
                                    name="clinicImages"
                                    listType="picture-card"
                                    fileList={clinicImagesFileList}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isImage) {
                                            message.error("You can only upload image files!");
                                            return false;
                                        }
                                        if (!isLt2M) {
                                            message.error("Image must be smaller than 2MB!");
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={({ fileList }) => setClinicImagesFileList(fileList)}
                                    onRemove={(file) => {
                                        setClinicImagesFileList(
                                            clinicImagesFileList.filter((f) => f.uid !== file.uid)
                                        );
                                        if (file.status === "done" && file.name) {
                                            setDeletedClinicImages([...deletedClinicImages, file.name]);
                                        }
                                    }}
                                    className="rounded-md"
                                    multiple
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Şəkillər əlavə et</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel} className="rounded-md">
                            İmtina Et
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClinicTable;