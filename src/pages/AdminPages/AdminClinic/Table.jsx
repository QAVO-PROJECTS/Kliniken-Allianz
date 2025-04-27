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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useGetAllClinicQuery } from "../../../services/userApi.jsx";
import { CLINIC_CARD_IMAGES } from "../../../contants.js";

const ClinicTable = () => {
    const { data: getAllClinic } = useGetAllClinicQuery();
    const clinics = getAllClinic?.data || [];

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingClinic, setEditingClinic] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingClinic(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            location: record.location,
        });
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
        setIsEditModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingClinic(null);
    };

    // Form submission handlers (stubbed)
    const handleAddClinic = (values) => {
        console.log("Add clinic:", values, cardFileList);
        // Implement API call to add clinic
        setIsAddModalVisible(false);
    };

    const handleEditClinic = (values) => {
        console.log("Edit clinic:", values, cardFileList);
        // Implement API call to update clinic
        setIsEditModalVisible(false);
    };

    // Delete handler (stubbed)
    const handleDelete = (id) => {
        console.log("Delete clinic:", id);
        // Implement API call to delete clinic
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
                            src={CLINIC_CARD_IMAGES + doctorImage}
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
                            src={CLINIC_CARD_IMAGES + serviceCardImage}
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
                            {record.clinicImages.length > 0
                                ? record.clinicImages.join(", ")
                                : "Şəkil yoxdur"}
                        </p>
                        <p>
                            <strong>Sertifikatlar:</strong>{" "}
                            {record.clinicSertificates.length > 0
                                ? record.clinicSertificates.join(", ")
                                : "Sertifikat yoxdur"}
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
        <div>
            <Button
                type="primary"
                onClick={showAddModal}
                style={{ marginBottom: 16 }}
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
            >
                <Form form={form} layout="vertical" onFinish={handleAddClinic}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Klinika Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Klinika Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Klinika Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="Lokasiya"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Lokasiya daxil edin" />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="clinicCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (RU)" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Əlavə Et
                        </Button>
                        <Button onClick={handleAddCancel}>İmtina Et</Button>
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
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditClinic}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Klinika Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Klinika Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Klinika Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="Lokasiya"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Lokasiya daxil edin" />
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="clinicCardImage"
                                    listType="picture-card"
                                    fileList={cardFileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setCardFileList(fileList)}
                                    onRemove={(file) =>
                                        setCardFileList(cardFileList.filter((f) => f.uid !== file.uid))
                                    }
                                >
                                    {cardFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Şəkil əlavə et</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Açıqlama (AZ)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionEng"
                                label="Açıqlama (EN)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="descriptionRu"
                                label="Açıqlama (RU)"
                                rules={[{ required: true, message: "Açıqlama daxil edin!" }]}
                            >
                                <Input.TextArea placeholder="Açıqlama daxil edin (RU)" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Düzəliş Et
                        </Button>
                        <Button onClick={handleEditCancel}>İmtina Et</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClinicTable;