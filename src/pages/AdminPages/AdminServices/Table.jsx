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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useGetAllServiceQuery, useGetAllCategoryQuery } from "../../../services/userApi.jsx";
import { SERVICE_CARD_IMAGES } from "../../../contants.js";

const ServicesTable = () => {
    const { data: getAllService } = useGetAllServiceQuery();
    const { data: getAllCategory } = useGetAllCategoryQuery();
    const services = getAllService?.data || [];
    const categories = getAllCategory?.data || [];

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingService, setEditingService] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);

    // Modal handlers
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingService(record);
        editForm.setFieldsValue({
            name: record.name,
            nameEng: record.nameEng,
            nameRu: record.nameRu,
            description: record.description,
            descriptionEng: record.descriptionEng,
            descriptionRu: record.descriptionRu,
            categoryId: record.categoryId,
        });
        setCardFileList(
            record.serviceCardImage
                ? [
                    {
                        uid: "-1",
                        name: record.serviceCardImage,
                        status: "done",
                        url: SERVICE_CARD_IMAGES + record.serviceCardImage,
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
        setEditingService(null);
    };

    // Form submission handlers (stubbed)
    const handleAddService = (values) => {
        console.log("Add service:", values, cardFileList);
        // Implement API call to add service
        setIsAddModalVisible(false);
    };

    const handleEditService = (values) => {
        console.log("Edit service:", values, cardFileList);
        // Implement API call to update service
        setIsEditModalVisible(false);
    };

    // Delete handler (stubbed)
    const handleDelete = (id) => {
        console.log("Delete service:", id);
        // Implement API call to delete service
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
            dataIndex: "serviceCardImage",
            key: "serviceCardImage",
            render: (serviceCardImage) => {
                if (!serviceCardImage) return <span>No Image</span>;
                return (
                    <img
                        src={SERVICE_CARD_IMAGES + serviceCardImage}
                        alt="Şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                );
            },
        },
        {
            title: "Xidmət adı",
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
        const categoryName = categories.find((category) => category.id === record.categoryId)?.name || "Bilinməyən Kateqoriya";

        const optionColumns = [
            {
                title: "Seçim Adı",
                dataIndex: "name",
                key: "name",
            },
        ];

        return (
            <div>
                <h4>Əlavə Məlumat</h4>
                <Row gutter={16}>
                    <Col span= {12}>
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
                            <strong>Kateqoriya:</strong> {categoryName}
                        </p>
                        <p>
                            <strong>Xidmət Şəkilləri:</strong>{" "}
                            {record.serviceImages.length > 0
                                ? record.serviceImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={SERVICE_CARD_IMAGES + img}
                                        alt={`Xidmət Şəkli ${index + 1}`}
                                        style={{ width: 50, height: 50, marginRight: 8, borderRadius: "5px", objectFit: "cover" }}
                                    />
                                ))
                                : "Şəkil yoxdur"}
                        </p>
                    </Col>
                </Row>
                <h4>Seçimlər</h4>
                <Table
                    columns={optionColumns}
                    dataSource={record.options}
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
                dataSource={services}
                pagination={{ pageSize: 6 }}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                        record.nameEng ||
                        record.nameRu ||
                        record.descriptionEng ||
                        record.descriptionRu ||
                        record.categoryId ||
                        record.serviceImages.length > 0 ||
                        record.options.length > 0,
                }}
            />

            {/* Add Service Modal */}
            <Modal
                title="Yeni Xidmət Əlavə Et"
                visible={isAddModalVisible}
                onCancel={handleAddCancel}
                footer={null}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleAddService}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Xidmət Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Xidmət Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Xidmət Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{ required: true, message: "Kateqoriya seçin!" }]}
                            >
                                <Select placeholder="Kateqoriya seçin">
                                    {categories.map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="serviceCardImage"
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

            {/* Edit Service Modal */}
            <Modal
                title="Xidmət Redaktə Et"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                width={800}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditService}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Xidmət Adı (AZ)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin" />
                            </Form.Item>
                            <Form.Item
                                name="nameEng"
                                label="Xidmət Adı (EN)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (EN)" />
                            </Form.Item>
                            <Form.Item
                                name="nameRu"
                                label="Xidmət Adı (RU)"
                                rules={[{ required: true, message: "Ad daxil edin!" }]}
                            >
                                <Input placeholder="Ad daxil edin (RU)" />
                            </Form.Item>
                            <Form.Item
                                name="categoryId"
                                label="Kateqoriya"
                                rules={[{ required: true, message: "Kateqoriya seçin!" }]}
                            >
                                <Select placeholder="Kateqoriya seçin">
                                    {categories.map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Şəkil">
                                <Upload
                                    name="serviceCardImage"
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

export default ServicesTable;